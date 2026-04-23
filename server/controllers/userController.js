const User = require('../models/User');
const Order = require('../models/Order');
const { uploadToCloudinary } = require('../middleware/upload');

// GET /api/users/me
exports.getMe = async (req, res) => {
  res.json(req.user);
};

// PUT /api/users/me
exports.updateMe = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address },
      { new: true, runValidators: true }
    );
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// GET /api/users (admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'client' }).sort({ createdAt: -1 });

    // Enrich with order stats
    const enriched = await Promise.all(users.map(async (u) => {
      const orders = await Order.find({ user: u._id });
      const totalSpent = orders
        .filter(o => ['confirmed', 'shipped', 'delivered'].includes(o.status))
        .reduce((sum, o) => sum + o.totalAmount, 0);
      return { ...u.toJSON(), orderCount: orders.length, totalSpent };
    }));

    res.json(enriched);
  } catch (err) {
    next(err);
  }
};

// GET /api/users/:id (admin)
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const orders = await Order.find({ user: user._id })
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 });

    res.json({ user, orders });
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/me/avatar
exports.updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Aucun fichier envoyé' });
    const url = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: url }, { new: true });
    res.json(user);
  } catch (err) { next(err); }
};

// GET /api/users/me/wishlist
exports.getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'name images price brand category isFeatured colors');
    res.json(user.wishlist);
  } catch (err) { next(err); }
};

// POST /api/users/me/wishlist/:productId
exports.addToWishlist = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { wishlist: req.params.productId } });
    res.json({ message: 'Added to wishlist' });
  } catch (err) { next(err); }
};

// DELETE /api/users/me/wishlist/:productId
exports.removeFromWishlist = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $pull: { wishlist: req.params.productId } });
    res.json({ message: 'Removed from wishlist' });
  } catch (err) { next(err); }
};

// DELETE /api/users/:id (admin)
exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};
