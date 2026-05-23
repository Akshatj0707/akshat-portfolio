const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title            : { type: String, required: true, trim: true },
  slug             : { type: String, required: true, unique: true, lowercase: true },
  category         : { type: String, required: true,
    enum: ['Web Development', 'Full-Stack', 'Interface Design', 'Machine Learning',
           'Mobile App', 'API Development', 'DevOps', 'Other'] },
  description      : { type: String, required: true },
  shortDescription : { type: String, maxlength: 220 },
  coverImage       : { type: String, required: true },
  images           : [String],
  tags             : [String],
  year             : { type: Number, default: () => new Date().getFullYear() },
  client           : String,
  role             : String,
  duration         : String,
  featured         : { type: Boolean, default: false },
  published        : { type: Boolean, default: true },
  order            : { type: Number, default: 0 },
  techStack        : [String],
  metrics          : [{ label: String, value: String, unit: String }],
  caseStudy        : {
    problem  : String,
    approach : String,
    solution : String,
    results  : String
  },
  liveUrl   : String,
  githubUrl : String,
  viewCount : { type: Number, default: 0 }
}, { timestamps: true });

projectSchema.index({ slug: 1, published: 1, featured: -1 });

module.exports = mongoose.model('Project', projectSchema);
