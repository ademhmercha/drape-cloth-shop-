const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  createOrder, getMyOrders, getAllOrders,
  getOrder, updateOrderStatus, getStats
} = require('../controllers/orderController');

router.get('/stats', protect, adminOnly, getStats);
router.get('/my', protect, getMyOrders);
router.get('/', protect, adminOnly, getAllOrders);
router.post('/', protect, createOrder);
router.get('/:id', protect, getOrder);
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
