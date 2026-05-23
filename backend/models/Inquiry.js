const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  fullName:    { type: String, required: true },
  phone:       { type: String, required: true },
  whatsapp:    { type: String, default: '' },
  email:       { type: String, default: '' },
  city:        { type: String, default: '' },
  service:     { type: String, default: '' },
  description: { type: String, default: '' },
  source:      { type: String, default: '' },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'completed', 'cancelled'],
    default: 'new'
  },
  notes:       { type: String, default: '' },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inquiry', inquirySchema);
