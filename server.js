require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Stripe webhook MUST be before body parsers ──────────────
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

// ── CORS ─────────────────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }));

// ── Body parsers ──────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Serve static frontend files ───────────────────────────────
app.use(express.static(path.join(__dirname, 'frontend')));

// ── API Routes ────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/contact',  require('./routes/contact'));
app.use('/api/payment',  require('./routes/payment'));

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status : 'ok',
    env    : process.env.NODE_ENV || 'development',
    db     : mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    ts     : new Date().toISOString()
  });
});

// ── SPA fallback ──────────────────────────────────────────────
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// ── Global error handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server Error' });
});

// ── Connect MongoDB then start server ─────────────────────────
const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error('❌  MONGODB_URI is not set in environment variables!');
  process.exit(1);
}

console.log('🔌  Connecting to MongoDB Atlas...');

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS : 30000,
  socketTimeoutMS          : 45000,
  connectTimeoutMS         : 30000,
  retryWrites              : true,
  w                        : 'majority'
})
.then(() => {
  console.log('✅  MongoDB connected successfully');
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀  Server running on port ${PORT}`);
    console.log(`🌐  Frontend → http://localhost:${PORT}`);
    console.log(`🔌  API      → http://localhost:${PORT}/api`);
    console.log(`🔑  Admin    → http://localhost:${PORT}/admin.html`);
    console.log(`💊  Health   → http://localhost:${PORT}/api/health`);
  });
})
.catch(err => {
  console.error('❌  MongoDB connection failed:', err.message);
  process.exit(1);
});

module.exports = app;
