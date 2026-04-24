const Review = require('../models/Review');

// GET /api/reviews/:productId
exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    const avg = reviews.length
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
      : 0;

    res.json({ reviews, average: avg, total: reviews.length });
  } catch (err) { next(err); }
};

// POST /api/reviews/:productId (protected)
exports.createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment?.trim()) {
      return res.status(400).json({ message: 'Note et commentaire requis' });
    }

    const existing = await Review.findOne({ product: req.params.productId, user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'Vous avez déjà laissé un avis pour ce produit' });
    }

    const review = await Review.create({
      product: req.params.productId,
      user: req.user._id,
      rating: Math.min(5, Math.max(1, parseInt(rating))),
      comment: comment.trim()
    });

    await review.populate('user', 'name avatar');
    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Vous avez déjà laissé un avis' });
    next(err);
  }
};

// DELETE /api/reviews/:id (admin or owner)
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Avis introuvable' });

    const isOwner = review.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    await review.deleteOne();
    res.json({ message: 'Avis supprimé' });
  } catch (err) { next(err); }
};
