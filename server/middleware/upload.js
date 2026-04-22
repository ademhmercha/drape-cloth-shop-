const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// Store files in memory, then stream to Cloudinary — compatible with cloudinary v2
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per image
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  }
});

// Upload a single buffer to Cloudinary and return the secure URL
const uploadToCloudinary = (buffer, mimetype) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'drape-products',
        resource_type: 'image',
        transformation: [{ width: 1200, height: 1500, crop: 'limit', quality: 'auto' }]
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });

// Middleware that first runs multer, then uploads all files to Cloudinary
const uploadImages = (fieldName, maxCount = 10) => [
  upload.array(fieldName, maxCount),
  async (req, res, next) => {
    if (!req.files?.length) return next();
    try {
      const urls = await Promise.all(
        req.files.map(file => uploadToCloudinary(file.buffer, file.mimetype))
      );
      // Attach URLs to req so controllers can use req.cloudinaryUrls
      req.cloudinaryUrls = urls;
      next();
    } catch (err) {
      next(err);
    }
  }
];

module.exports = { upload, uploadImages, uploadToCloudinary };
