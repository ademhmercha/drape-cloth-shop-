const PromoCode = require('../models/PromoCode');

// POST /api/promo/validate (protected — client)
exports.validatePromo = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) return res.status(400).json({ message: 'Code requis' });

    const promo = await PromoCode.findOne({ code: code.trim().toUpperCase() });

    if (!promo || !promo.isActive) {
      return res.status(404).json({ message: 'Code promo invalide ou inactif' });
    }
    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Code promo expiré' });
    }
    if (promo.maxUses !== null && promo.usedCount >= promo.maxUses) {
      return res.status(400).json({ message: 'Code promo épuisé' });
    }
    if (subtotal < promo.minOrderAmount) {
      return res.status(400).json({
        message: `Commande minimum ${promo.minOrderAmount} DT pour ce code`
      });
    }

    const discountAmount = promo.type === 'percent'
      ? Math.round((subtotal * promo.value / 100) * 100) / 100
      : Math.min(promo.value, subtotal);

    res.json({
      valid: true,
      code: promo.code,
      type: promo.type,
      value: promo.value,
      discountAmount
    });
  } catch (err) { next(err); }
};

// GET /api/promo (admin)
exports.getAllPromos = async (req, res, next) => {
  try {
    const promos = await PromoCode.find().sort({ createdAt: -1 });
    res.json(promos);
  } catch (err) { next(err); }
};

// POST /api/promo (admin)
exports.createPromo = async (req, res, next) => {
  try {
    const { code, type, value, minOrderAmount, maxUses, expiresAt } = req.body;
    const promo = await PromoCode.create({
      code: code.trim().toUpperCase(),
      type,
      value,
      minOrderAmount: minOrderAmount || 0,
      maxUses: maxUses || null,
      expiresAt: expiresAt || null
    });
    res.status(201).json(promo);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Ce code existe déjà' });
    next(err);
  }
};

// PATCH /api/promo/:id/toggle (admin)
exports.togglePromo = async (req, res, next) => {
  try {
    const promo = await PromoCode.findById(req.params.id);
    if (!promo) return res.status(404).json({ message: 'Code non trouvé' });
    promo.isActive = !promo.isActive;
    await promo.save();
    res.json(promo);
  } catch (err) { next(err); }
};

// DELETE /api/promo/:id (admin)
exports.deletePromo = async (req, res, next) => {
  try {
    await PromoCode.findByIdAndDelete(req.params.id);
    res.json({ message: 'Code supprimé' });
  } catch (err) { next(err); }
};
