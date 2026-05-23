const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  url:        { type: String, required: true },
  publicId:   { type: String, required: true },
  thumbnail:  { type: String },
  caption:    { type: String, default: '' },
  category:   {
    type: String,
    enum: ['Glass Partition', 'Gypsum Partition', 'Interior Decoration', 'Electrical Work', 'Plumbing Work', 'General'],
    default: 'General'
  },
  order:      { type: Number, default: 0 },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gallery', gallerySchema);
