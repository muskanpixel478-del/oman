const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const Inquiry = require('../models/Inquiry');
const auth = require('../middleware/auth');

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many submissions. Try again in 1 hour.' }
});

// Send WhatsApp notification via wa.me redirect link in response
async function sendWhatsAppNotification(inquiry) {
  const msg = `*New Inquiry Received!*\n\n` +
    `*Name:* ${inquiry.fullName}\n` +
    `*Phone:* ${inquiry.phone}\n` +
    `*WhatsApp:* ${inquiry.whatsapp || 'N/A'}\n` +
    `*Email:* ${inquiry.email || 'N/A'}\n` +
    `*City:* ${inquiry.city}\n` +
    `*Service:* ${inquiry.service}\n` +
    `*Description:* ${inquiry.description || 'N/A'}\n` +
    `*Source:* ${inquiry.source || 'N/A'}\n` +
    `*Time:* ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Muscat' })}`;
  return encodeURIComponent(msg);
}

// POST /api/inquiries — public, submit form
router.post('/', submitLimiter, async (req, res) => {
  try {
    const { fullName, phone, whatsapp, email, city, service, description, source } = req.body;
    if (!fullName || !phone)
      return res.status(400).json({ success: false, message: 'Name and phone are required' });

    const inquiry = await Inquiry.create({ fullName, phone, whatsapp, email, city, service, description, source });
    const waMsg = await sendWhatsAppNotification(inquiry);
    const waUrl = `https://wa.me/${(process.env.ADMIN_WHATSAPP || '+96892903653').replace(/\D/g, '')}?text=${waMsg}`;

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      inquiryId: inquiry._id,
      whatsappUrl: waUrl
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/inquiries — admin only
router.get('/', auth, async (req, res) => {
  try {
    const { status, service, city, search, from, to } = req.query;
    const filter = {};
    if (status)  filter.status  = status;
    if (service) filter.service = service;
    if (city)    filter.city    = city;
    if (search)  filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { phone:    { $regex: search, $options: 'i' } }
    ];
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to)   filter.createdAt.$lte = new Date(to);
    }
    const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 });
    const today = new Date(); today.setHours(0,0,0,0);
    const todayCount = await Inquiry.countDocuments({ createdAt: { $gte: today } });
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthCount = await Inquiry.countDocuments({ createdAt: { $gte: monthStart } });
    res.json({ success: true, inquiries, todayCount, monthCount });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/inquiries/:id — admin only
router.get('/:id', auth, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/inquiries/:id — admin only, update status/notes
router.put('/:id', auth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(notes !== undefined && { notes }) },
      { new: true }
    );
    if (!inquiry) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/inquiries/:id — admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/inquiries/export/excel — admin only
router.get('/export/excel', auth, async (req, res) => {
  try {
    const XLSX = require('xlsx');
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    const data = inquiries.map(i => ({
      Name: i.fullName, Phone: i.phone, WhatsApp: i.whatsapp, Email: i.email,
      City: i.city, Service: i.service, Description: i.description,
      Source: i.source, Status: i.status, Notes: i.notes,
      Date: new Date(i.createdAt).toLocaleString()
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inquiries');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename=inquiries.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buf);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Export failed' });
  }
});

module.exports = router;
