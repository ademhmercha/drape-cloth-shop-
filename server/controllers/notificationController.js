const Notification = require('../models/Notification');
const User = require('../models/User');

// GET /api/notifications/my
exports.getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/notifications/:id/read
exports.markRead = async (req, res, next) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notif) return res.status(404).json({ message: 'Notification not found' });
    res.json(notif);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/notifications/read-all
exports.markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
};

// POST /api/notifications/broadcast (admin)
exports.broadcast = async (req, res, next) => {
  try {
    const { message, type = 'promo', userId } = req.body;

    let users;
    if (userId) {
      users = [{ _id: userId }];
    } else {
      users = await User.find({ role: 'client' }, '_id');
    }

    const notifications = users.map(u => ({
      user: u._id,
      message,
      type
    }));

    await Notification.insertMany(notifications);
    res.json({ message: `Sent to ${notifications.length} users` });
  } catch (err) {
    next(err);
  }
};
