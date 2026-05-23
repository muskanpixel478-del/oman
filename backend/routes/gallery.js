const router = require('express').Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Gallery = require('../models/Gallery');
const auth = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ama-website',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 900, crop: 'limit', quality: 'auto:good' }]
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only JPG, PNG, WEBP allowed'));
  }
});

// GET /api/gallery — public, returns all images
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category } : {};
    const images = await Gallery.find(filter).sort({ order: 1, uploadedAt: -1 });
    res.json({ success: true, images });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/gallery/upload — admin only, multiple files
router.post('/upload', auth, upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ success: false, message: 'No files uploaded' });

    const { category = 'General', caption = '' } = req.body;
    const maxOrder = await Gallery.findOne().sort({ order: -1 }).select('order');
    let orderStart = maxOrder ? maxOrder.order + 1 : 0;

    const saved = await Promise.all(req.files.map((file, i) =>
      Gallery.create({
        url:       file.path,
        publicId:  file.filename,
        thumbnail: file.path.replace('/upload/', '/upload/w_400,h_300,c_fill/'),
        category,
        caption,
        order: orderStart + i
      })
    ));

    res.json({ success: true, message: `${saved.length} image(s) uploaded`, images: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/gallery/:id — admin only, update caption/category
router.put('/:id', auth, async (req, res) => {
  try {
    const { caption, category, order } = req.body;
    const image = await Gallery.findByIdAndUpdate(
      req.params.id,
      { ...(caption !== undefined && { caption }), ...(category && { category }), ...(order !== undefined && { order }) },
      { new: true }
    );
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
    res.json({ success: true, image });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/gallery/:id — admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
    await cloudinary.uploader.destroy(image.publicId);
    await image.deleteOne();
    res.json({ success: true, message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/gallery/bulk/delete — admin only, delete multiple
router.post('/bulk/delete', auth, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !ids.length) return res.status(400).json({ success: false, message: 'No IDs provided' });
    const images = await Gallery.find({ _id: { $in: ids } });
    await Promise.all(images.map(img => cloudinary.uploader.destroy(img.publicId)));
    await Gallery.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, message: `${images.length} image(s) deleted` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/gallery/reorder/all — admin only, save new order
router.put('/reorder/all', auth, async (req, res) => {
  try {
    const { order } = req.body; // [{ id, order }, ...]
    await Promise.all(order.map(({ id, order: o }) => Gallery.findByIdAndUpdate(id, { order: o })));
    res.json({ success: true, message: 'Order saved' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
