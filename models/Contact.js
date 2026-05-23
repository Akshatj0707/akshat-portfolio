const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name        : { type: String, required: true, trim: true },
  email       : { type: String, required: true, lowercase: true, trim: true },
  projectType : { type: String, enum: ['Full-Stack Web App','API Development','Real-Time System',
                  'AI / ML Integration','Internship / Job','Freelance Project','Collaboration','Other'] },
  budget      : String,
  message     : { type: String, required: true },
  status      : { type: String, enum: ['new','read','replied','archived'], default: 'new' },
  ipAddress   : String,
  userAgent   : String
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
