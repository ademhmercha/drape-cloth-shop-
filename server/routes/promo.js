const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const { validatePromo, getAllPromos, createPromo, togglePromo, deletePromo } = require('../controllers/promoController');

router.post('/validate', protect, validatePromo);
router.get('/', protect, adminOnly, getAllPromos);
router.post('/', protect, adminOnly, createPromo);
router.patch('/:id/toggle', protect, adminOnly, togglePromo);
router.delete('/:id', protect, adminOnly, deletePromo);

module.exports = router;
