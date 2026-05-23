const router = require('express').Router();
const Content = require('../models/Content');
const auth = require('../middleware/auth');

// GET /api/content — public
router.get('/', async (req, res) => {
  try {
    const content = await Content.findOne();
    res.json({ success: true, content });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/content — admin only, update any field
router.put('/', auth, async (req, res) => {
  try {
    let content = await Content.findOne();
    if (!content) content = await Content.create({});
    const allowed = ['whatsapp', 'phone', 'hours', 'address', 'about', 'stats', 'services'];
    allowed.forEach(key => {
      if (req.body[key] !== undefined) content[key] = req.body[key];
    });
    content.updatedAt = new Date();
    await content.save();
    res.json({ success: true, content, message: 'Content updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
