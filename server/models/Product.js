const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: {
    type: String,
    required: true,
    enum: ['men', 'women', 'kids', 'accessories']
  },
  sizes: [{
    size: { type: String, required: true }, // XS/S/M/L/XL/XXL or numeric
    stock: { type: Number, required: true, min: 0, default: 0 }
  }],
  colors: [{
    name: { type: String, required: true },
    hex: { type: String, required: true }
  }],
  images: [String], // Cloudinary URLs
  brand: { type: String, trim: true },
  tags: [String],
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Full-text search index
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
