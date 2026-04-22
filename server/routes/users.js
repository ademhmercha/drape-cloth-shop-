const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getMe, updateMe, getWishlist, addToWishlist, removeFromWishlist, getAllUsers, getUserById, deleteUser } = require('../controllers/userController');

router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.get('/me/wishlist', protect, getWishlist);
router.post('/me/wishlist/:productId', protect, addToWishlist);
router.delete('/me/wishlist/:productId', protect, removeFromWishlist);

router.get('/', protect, adminOnly, getAllUsers);
router.get('/:id', protect, adminOnly, getUserById);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
