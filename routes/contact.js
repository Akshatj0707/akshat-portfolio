// routes/contact.js  –  Contact form submissions
const express    = require('express');
const router     = express.Router();
const nodemailer = require('nodemailer');
const Contact    = require('../models/Contact');
const { protect } = require('../middleware/auth');

// Send email notification to Akshat
async function sendEmail(contact) {
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER.includes('your')) return;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  await transporter.sendMail({
    from   : `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to     : process.env.EMAIL_TO || 'akshatjain9804@gmail.com',
    subject: `📩 New Message: ${contact.name} — ${contact.projectType || 'Inquiry'}`,
    html   : `
      <div style="font-family:Inter,sans-serif;max-width:600px;background:#0f0f0f;color:#e5e2e1;padding:40px;border-radius:8px;">
        <h2 style="color:#b6c4ff;margin-bottom:24px;">New Portfolio Contact</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:12px 0;border-bottom:1px solid #333;color:#8e9192;width:130px;">Name</td>
              <td style="padding:12px 0;border-bottom:1px solid #333;">${contact.name}</td></tr>
          <tr><td style="padding:12px 0;border-bottom:1px solid #333;color:#8e9192;">Email</td>
              <td style="padding:12px 0;border-bottom:1px solid #333;"><a href="mailto:${contact.email}" style="color:#b6c4ff;">${contact.email}</a></td></tr>
          <tr><td style="padding:12px 0;border-bottom:1px solid #333;color:#8e9192;">Type</td>
              <td style="padding:12px 0;border-bottom:1px solid #333;">${contact.projectType || 'N/A'}</td></tr>
          <tr><td style="padding:12px 0;border-bottom:1px solid #333;color:#8e9192;">Budget</td>
              <td style="padding:12px 0;border-bottom:1px solid #333;">${contact.budget || 'N/A'}</td></tr>
          <tr><td style="padding:12px 0;color:#8e9192;vertical-align:top;">Message</td>
              <td style="padding:12px 0;">${contact.message}</td></tr>
        </table>
        <p style="margin-top:32px;font-size:12px;color:#555;">Sent from akshatjain.dev portfolio</p>
      </div>`
  });
}

// ── POST /api/contact  (Public) ────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, email, projectType, budget, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required' });
    }
    const contact = await Contact.create({
      name, email, projectType, budget, message,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    sendEmail(contact).catch(e => console.error('Email error:', e.message));
    res.status(201).json({
      success: true,
      message: "Message sent! Akshat will reply within 24 hours.",
      id     : contact._id
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/contact  (Admin) ──────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [contacts, total] = await Promise.all([
      Contact.find(query).sort({ createdAt: -1 }).limit(parseInt(limit)).skip(skip),
      Contact.countDocuments(query)
    ]);
    res.json({
      success   : true,
      data      : contacts,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PATCH /api/contact/:id  (Admin – update status) ───────────
router.patch('/:id', protect, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    );
    res.json({ success: true, data: contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/contact/:id  (Admin) ──────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
