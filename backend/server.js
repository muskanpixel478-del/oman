require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();

// ── Middleware ─────────────────────────────────────────────
app.use(cors({
  origin: [process.env.FRONTEND_URL || '*', 'http://localhost:3000', 'http://localhost:5000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api', globalLimiter);

// ── Database ───────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ama_website')
  .then(() => {
    console.log('✅ MongoDB connected');
    seedAdmin();
  })
  .catch(err => console.error('❌ MongoDB error:', err));

// Seed default admin on first run
async function seedAdmin() {
  const Admin = require('./models/Admin');
  const bcrypt = require('bcryptjs');
  const exists = await Admin.findOne({ username: process.env.ADMIN_USERNAME || 'admin' });
  if (!exists) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@2024!', 12);
    await Admin.create({ username: process.env.ADMIN_USERNAME || 'admin', password: hash });
    console.log('✅ Default admin created — change password immediately!');
  }
  // Seed default content
  const Content = require('./models/Content');
  const cnt = await Content.findOne({});
  if (!cnt) {
    await Content.create({
      whatsapp: '+968 9290 3653',
      phone: '+968 9290 3653',
      hours: '8:00 AM – 10:00 PM',
      address: 'Muscat, Oman',
      stats: { projects: 50, years: 5, clients: 200, awards: 10 },
      about: 'Abu Muhammad Azan is the leading company for interior decoration and construction in Oman.',
      services: [
        { name: 'Glass Partition', description: 'Premium quality glass partition works for offices and homes.' },
        { name: 'Gypsum Partition', description: 'Expert gypsum partition and ceiling works.' },
        { name: 'Interior Decoration', description: 'Complete interior decoration solutions.' },
        { name: 'Electrical Work', description: 'Professional electrical installation and maintenance.' },
        { name: 'Plumbing Work', description: 'Expert plumbing services all over Oman.' }
      ]
    });
    console.log('✅ Default content seeded');
  }
}

// ── Routes ─────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/gallery',   require('./routes/gallery'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/content',   require('./routes/content'));

// ── Serve Admin Panel ──────────────────────────────────────
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin', 'login.html')));
app.get('/admin/*', (req, res) => {
  const page = req.params[0];
  const filePath = path.join(__dirname, 'admin', page);
  res.sendFile(filePath, err => {
    if (err) res.sendFile(path.join(__dirname, 'admin', 'login.html'));
  });
});

// ── Health check ───────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// ── 404 ────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// ── Error handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}/admin`));
