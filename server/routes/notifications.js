const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getMyNotifications, markRead, markAllRead, broadcast
} = require('../controllers/notificationController');

router.get('/my', protect, getMyNotifications);
router.patch('/read-all', protect, markAllRead);
router.patch('/:id/read', protect, markRead);
router.post('/broadcast', protect, adminOnly, broadcast);

module.exports = router;
