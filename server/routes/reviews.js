const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getProductReviews, createReview, deleteReview } = require('../controllers/reviewController');

router.get('/:productId', getProductReviews);
router.post('/:productId', protect, createReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
