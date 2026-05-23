// ═══════════════════════════════════════════════════════════════
//  Akshat Jain Portfolio — Main Server
//  Express serves both REST API + static frontend
// ═══════════════════════════════════════════════════════════════
require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Stripe webhook MUST be registered before body parsers ──────
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

// ── CORS ───────────────────────────────────────────────────────
app.use(cors({
  origin: function (origin, callback) {
    const allowed = process.env.FRONTEND_URL
      ? [process.env.FRONTEND_URL, 'http://localhost:5000', 'http://localhost:3000']
      : true;
    if (allowed === true || !origin) return callback(null, true);
    if (allowed.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// ── Body parsers ───────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Serve static frontend files ────────────────────────────────
app.use(express.static(path.join(__dirname, 'frontend')));

// ── API Routes ─────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/contact',  require('./routes/contact'));
app.use('/api/payment',  require('./routes/payment'));

// ── Health check ───────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status : 'ok',
    env    : process.env.NODE_ENV || 'development',
    db     : mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    ts     : new Date().toISOString()
  });
});

// ── SPA fallback – serve index.html for every non-API route ───
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// ── Global error handler ───────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// ── Connect to MongoDB then start listening ────────────────────
const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error('❌  MONGODB_URI env variable is missing!');
  console.error('    Add it in Render → Environment tab');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 15000 })
  .then(() => {
    console.log('✅  MongoDB connected');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀  Server running  →  http://localhost:${PORT}`);
      console.log(`🌐  Frontend        →  http://localhost:${PORT}`);
      console.log(`🔌  API             →  http://localhost:${PORT}/api`);
      console.log(`🔑  Admin Panel     →  http://localhost:${PORT}/admin.html`);
      console.log(`💊  Health Check    →  http://localhost:${PORT}/api/health`);
    });
  })
  .catch(err => {
    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;
