// routes/payment.js  –  Stripe payments for Akshat's dev services
const express = require('express');
const router  = express.Router();
const Order   = require('../models/Order');
const { protect } = require('../middleware/auth');

// Akshat's freelance developer services (prices in paise = INR×100)
const SERVICES = {
  'fullstack-webapp': {
    name       : 'Full-Stack Web Application',
    amount     : 4999900,   // ₹49,999
    currency   : 'inr',
    description: 'Complete full-stack web app — React.js + Node.js + MongoDB + REST API + deployment'
  },
  'api-development': {
    name       : 'REST API Development',
    amount     : 1999900,   // ₹19,999
    currency   : 'inr',
    description: 'Secure REST API with JWT auth, RBAC, MongoDB, Express.js, full documentation'
  },
  'realtime-system': {
    name       : 'Real-Time System (Socket.io)',
    amount     : 2999900,   // ₹29,999
    currency   : 'inr',
    description: 'Real-time features: live tracking, chat, dashboards using Socket.io + WebSocket'
  },
  'ai-integration': {
    name       : 'AI / ML Integration',
    amount     : 3999900,   // ₹39,999
    currency   : 'inr',
    description: 'Generative AI or Computer Vision feature integration into your existing product'
  },
  'consultation': {
    name       : '1-Hour Technical Consultation',
    amount     : 199900,    // ₹1,999
    currency   : 'inr',
    description: 'Architecture review, tech stack advice, code audit, or career guidance session'
  },
  'bug-fix': {
    name       : 'Bug Fix & Code Review',
    amount     : 499900,    // ₹4,999
    currency   : 'inr',
    description: 'Debug, fix, and review your codebase — fast turnaround, clean solution'
  }
};

// ── GET /api/payment/services  (Public) ───────────────────────
router.get('/services', (req, res) => {
  const services = Object.entries(SERVICES).map(([id, s]) => ({
    id,
    name             : s.name,
    amount           : s.amount,
    currency         : s.currency,
    description      : s.description,
    amountFormatted  : `₹${(s.amount / 100).toLocaleString('en-IN')}`
  }));
  res.json({ success: true, data: services });
});

// ── POST /api/payment/create-intent  (Public) ─────────────────
router.post('/create-intent', async (req, res) => {
  const { serviceId, clientName, clientEmail } = req.body;
  if (!serviceId || !clientName || !clientEmail) {
    return res.status(400).json({
      success: false,
      message: 'serviceId, clientName, and clientEmail are required'
    });
  }
  const service = SERVICES[serviceId];
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

  try {
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('your')) {
      return res.status(503).json({
        success: false,
        message: 'Payment is not configured yet. Please contact akshatjain9804@gmail.com directly.'
      });
    }
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const paymentIntent = await stripe.paymentIntents.create({
      amount  : service.amount,
      currency: service.currency,
      description   : service.description,
      receipt_email : clientEmail,
      metadata      : { serviceId, clientName, clientEmail, serviceName: service.name },
      automatic_payment_methods: { enabled: true }
    });

    const order = await Order.create({
      clientName, clientEmail,
      service   : service.name,
      serviceId,
      amount    : service.amount,
      currency  : service.currency,
      stripePaymentIntentId: paymentIntent.id,
      description: service.description,
      status    : 'pending'
    });

    res.json({
      success     : true,
      clientSecret: paymentIntent.client_secret,
      orderId     : order._id,
      amount      : service.amount,
      currency    : service.currency,
      serviceName : service.name
    });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/payment/webhook  (Stripe → auto-update order) ───
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  if (!process.env.STRIPE_WEBHOOK_SECRET ||
      process.env.STRIPE_WEBHOOK_SECRET.includes('your')) {
    return res.json({ received: true, note: 'webhook secret not configured' });
  }
  let event;
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ message: `Webhook error: ${err.message}` });
  }
  try {
    if (event.type === 'payment_intent.succeeded') {
      await Order.findOneAndUpdate(
        { stripePaymentIntentId: event.data.object.id },
        { status: 'succeeded' }
      );
    } else if (event.type === 'payment_intent.payment_failed') {
      await Order.findOneAndUpdate(
        { stripePaymentIntentId: event.data.object.id },
        { status: 'failed' }
      );
    }
  } catch (err) {
    console.error('Webhook DB error:', err.message);
  }
  res.json({ received: true });
});

// ── GET /api/payment/orders  (Admin) ──────────────────────────
router.get('/orders', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [orders, total, revenue] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).limit(parseInt(limit)).skip(skip),
      Order.countDocuments(query),
      Order.aggregate([
        { $match: { status: 'succeeded' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);
    res.json({
      success     : true,
      data        : orders,
      pagination  : { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
      totalRevenue: revenue[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
