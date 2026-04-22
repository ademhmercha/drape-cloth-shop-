const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getMe, updateMe, getAllUsers, getUserById, deleteUser } = require('../controllers/userController');

router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

router.get('/', protect, adminOnly, getAllUsers);
router.get('/:id', protect, adminOnly, getUserById);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
