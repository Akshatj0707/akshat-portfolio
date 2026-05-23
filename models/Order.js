const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  clientName           : { type: String, required: true },
  clientEmail          : { type: String, required: true, lowercase: true },
  service              : { type: String, required: true },
  serviceId            : { type: String, required: true },
  amount               : { type: Number, required: true }, // paise (INR) or cents
  currency             : { type: String, default: 'inr' },
  stripePaymentIntentId: { type: String },
  status               : { type: String,
    enum: ['pending','processing','succeeded','failed','refunded','canceled'],
    default: 'pending' },
  description : String,
  metadata    : mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
