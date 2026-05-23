const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  whatsapp: { type: String, default: '+968 9290 3653' },
  phone:    { type: String, default: '+968 9290 3653' },
  hours:    { type: String, default: '8:00 AM – 10:00 PM' },
  address:  { type: String, default: 'Muscat, Oman' },
  stats: {
    projects: { type: Number, default: 50 },
    years:    { type: Number, default: 5 },
    clients:  { type: Number, default: 200 },
    awards:   { type: Number, default: 10 }
  },
  about: { type: String, default: '' },
  services: [{
    name:        { type: String },
    description: { type: String },
    order:       { type: Number, default: 0 }
  }],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Content', contentSchema);
