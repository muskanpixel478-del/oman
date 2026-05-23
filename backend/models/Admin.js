const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

adminSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

adminSchema.methods.incLoginAttempts = async function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    await this.updateOne({ loginAttempts: 1, lockUntil: null });
    return;
  }
  const updates = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= 3) {
    updates.$set = { lockUntil: new Date(Date.now() + 10 * 60 * 1000) };
  }
  await this.updateOne(updates);
};

adminSchema.methods.resetLoginAttempts = async function () {
  await this.updateOne({ loginAttempts: 0, lockUntil: null, lastLogin: new Date() });
};

module.exports = mongoose.model('Admin', adminSchema);
