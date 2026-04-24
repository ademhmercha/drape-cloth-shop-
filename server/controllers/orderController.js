const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const PromoCode = require('../models/PromoCode');
const { sendWhatsAppMessage } = require('../services/whatsappService');

const SHIPPING_FEE = 8; // DT, fixed

// WhatsApp message templates (French — Tunisian market)
const buildWhatsAppMessage = (status, user, order) => {
  const ref = order._id.toString().slice(-6).toUpperCase();
  const templates = {
    confirmed: `🎉 Bonjour ${user.name} !\n\nVotre commande DRAPE *#${ref}* a été *confirmée*.\n\n📦 ${order.items.length} article(s)\n💰 Total: ${order.totalAmount} DT\n💵 Paiement à la livraison\n\nMerci pour votre confiance ! 🛍️`,
    shipped:   `🚚 Bonjour ${user.name} !\n\nVotre commande DRAPE *#${ref}* est en route !\n\nPréparez *${order.totalAmount} DT* en espèces. À bientôt ! 👗`,
    delivered: `✅ Bonjour ${user.name} !\n\nVotre commande *#${ref}* a été livrée. Profitez bien de vos nouvelles pièces ! 💛`,
    cancelled: `❌ Bonjour ${user.name},\n\nVotre commande *#${ref}* a été annulée.\n\nContactez-nous pour plus d'info. 🙏`
  };
  return templates[status] || null;
};

// POST /api/orders (client)
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, promoCode } = req.body;
    if (!items?.length) return res.status(400).json({ message: 'No items in order' });

    // Validate stock for each item before saving
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        return res.status(400).json({ message: `Product ${item.product} not available` });
      }
      const sizeEntry = product.sizes.find(s => s.size === item.size);
      if (!sizeEntry || sizeEntry.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${product.name}" in size ${item.size}`
        });
      }
    }

    // Deduct stock
    for (const item of items) {
      await Product.updateOne(
        { _id: item.product, 'sizes.size': item.size },
        { $inc: { 'sizes.$.stock': -item.quantity } }
      );
    }

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    // Apply promo code if provided
    let discount = 0;
    let appliedCode = null;
    if (promoCode) {
      const promo = await PromoCode.findOne({ code: promoCode.trim().toUpperCase(), isActive: true });
      if (promo &&
          (!promo.expiresAt || promo.expiresAt > new Date()) &&
          (promo.maxUses === null || promo.usedCount < promo.maxUses) &&
          subtotal >= promo.minOrderAmount) {
        discount = promo.type === 'percent'
          ? Math.round((subtotal * promo.value / 100) * 100) / 100
          : Math.min(promo.value, subtotal);
        appliedCode = promo.code;
        await PromoCode.findByIdAndUpdate(promo._id, { $inc: { usedCount: 1 } });
      }
    }

    const totalAmount = Math.max(0, subtotal + SHIPPING_FEE - discount);

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      shippingFee: SHIPPING_FEE,
      discount,
      promoCode: appliedCode,
      shippingAddress
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/my (client)
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// GET /api/orders (admin)
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, from, to, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email phone')
        .populate('items.product', 'name images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(filter)
    ]);

    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/:id
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone address')
      .populate('items.product', 'name images price');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Clients can only see their own orders
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/orders/:id/status (admin only)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, adminNote } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updates = { status };
    if (adminNote !== undefined) updates.adminNote = adminNote;
    if (status === 'confirmed') updates.confirmedAt = new Date();

    const order = await Order.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate('user', 'name phone email');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Create in-app notification for the user
    await Notification.create({
      user: order.user._id,
      message: `Votre commande #${order._id.toString().slice(-6).toUpperCase()} est maintenant ${status}.`,
      type: 'order_update'
    });

    // Send WhatsApp — non-blocking, errors are swallowed inside the service
    const message = buildWhatsAppMessage(status, order.user, order);
    if (message) {
      sendWhatsAppMessage(order.user.phone, message); // intentionally not awaited at top level
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/revenue-series?days=30 (admin)
exports.getRevenueSeries = async (req, res, next) => {
  try {
    const days = Math.min(parseInt(req.query.days) || 30, 90);
    const from = new Date();
    from.setDate(from.getDate() - days + 1);
    from.setHours(0, 0, 0, 0);

    const raw = await Order.aggregate([
      {
        $match: {
          status: { $in: ['confirmed', 'shipped', 'delivered'] },
          createdAt: { $gte: from }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill missing days with 0
    const result = Array.from({ length: days }, (_, i) => {
      const d = new Date(from);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      const found = raw.find(r => r._id === key);
      return { date: key, revenue: found ? Math.round(found.revenue) : 0, orders: found?.orders || 0 };
    });

    res.json(result);
  } catch (err) { next(err); }
};

// GET /api/orders/stats (admin)
exports.getStats = async (req, res, next) => {
  try {
    const [totalOrders, pendingOrders, revenue, activeProducts] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.aggregate([
        { $match: { status: { $in: ['confirmed', 'shipped', 'delivered'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      require('../models/Product').countDocuments({ isActive: true })
    ]);

    res.json({
      totalOrders,
      pendingOrders,
      totalRevenue: revenue[0]?.total || 0,
      activeProducts
    });
  } catch (err) {
    next(err);
  }
};
