const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

// GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const {
      category, size, color, minPrice, maxPrice,
      search, sort, page = 1, limit = 10
    } = req.query;

    const filter = { isActive: true };

    if (category) filter.category = category;

    if (size) filter['sizes.size'] = size;

    if (color) filter['colors.name'] = { $regex: color, $options: 'i' };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    let sortOption = { createdAt: -1 }; // default: newest
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter)
    ]);

    res.json({
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// POST /api/products (admin)
exports.createProduct = async (req, res, next) => {
  try {
    const images = req.cloudinaryUrls || [];

    let sizes = req.body.sizes;
    let colors = req.body.colors;
    let tags = req.body.tags;

    // Parse JSON strings sent from FormData
    if (typeof sizes === 'string') sizes = JSON.parse(sizes);
    if (typeof colors === 'string') colors = JSON.parse(colors);
    if (typeof tags === 'string') tags = JSON.parse(tags);

    const product = await Product.create({
      ...req.body,
      sizes,
      colors,
      tags,
      images,
      isFeatured: req.body.isFeatured === 'true',
      isActive: req.body.isActive !== 'false'
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// PUT /api/products/:id (admin)
exports.updateProduct = async (req, res, next) => {
  try {
    const updates = { ...req.body };

    if (typeof updates.sizes === 'string') updates.sizes = JSON.parse(updates.sizes);
    if (typeof updates.colors === 'string') updates.colors = JSON.parse(updates.colors);
    if (typeof updates.tags === 'string') updates.tags = JSON.parse(updates.tags);

    // New images uploaded to Cloudinary
    if (req.cloudinaryUrls?.length > 0) {
      updates.images = req.cloudinaryUrls;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:id (admin) — soft delete
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deactivated', product });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/products/:id/stock (admin)
exports.updateStock = async (req, res, next) => {
  try {
    const { sizes } = req.body; // [{ size, stock }]
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    sizes.forEach(({ size, stock }) => {
      const entry = product.sizes.find(s => s.size === size);
      if (entry) entry.stock = stock;
    });

    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
};
