const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  type: { type: String, enum: ['percent', 'fixed'], required: true },
  value: { type: Number, required: true, min: 1 }, // % or DT amount
  minOrderAmount: { type: Number, default: 0 },    // min subtotal required
  maxUses: { type: Number, default: null },         // null = unlimited
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('PromoCode', promoSchema);
