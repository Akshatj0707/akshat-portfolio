// routes/projects.js  –  CRUD for portfolio projects
const express = require('express');
const router  = express.Router();
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

// ── GET /api/projects  (Public) ────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { category, featured, limit = 20, page = 1 } = req.query;
    const query = { published: true };
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [projects, total] = await Promise.all([
      Project.find(query)
        .sort({ order: 1, createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip),
      Project.countDocuments(query)
    ]);

    res.json({
      success   : true,
      data      : projects,
      pagination: { total, page: parseInt(page), limit: parseInt(limit),
                    pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/projects/:slug  (Public) ─────────────────────────
router.get('/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, published: true });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    project.viewCount = (project.viewCount || 0) + 1;
    await project.save();
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/projects  (Admin) ────────────────────────────────
router.post('/', protect, async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── PUT /api/projects/:id  (Admin) ────────────────────────────
router.put('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id, req.body,
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/projects/:id  (Admin) ─────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
