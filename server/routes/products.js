const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const { uploadImages } = require('../middleware/upload');
const {
  getProducts, getProduct, createProduct,
  updateProduct, deleteProduct, updateStock
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/:id', getProduct);

router.post('/', protect, adminOnly, ...uploadImages('images', 10), createProduct);
router.put('/:id', protect, adminOnly, ...uploadImages('images', 10), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.patch('/:id/stock', protect, adminOnly, updateStock);

module.exports = router;
