const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendPasswordResetEmail } = require('../services/emailService');

const generateAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });

const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, phone });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    setRefreshCookie(res, refreshToken);

    res.status(201).json({ user, accessToken });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    setRefreshCookie(res, refreshToken);

    res.json({ user, accessToken });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/refresh-token
exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    const accessToken = generateAccessToken(user._id);
    const newRefresh = generateRefreshToken(user._id);
    setRefreshCookie(res, newRefresh);

    res.json({ accessToken, user });
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

// POST /api/auth/logout
exports.logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email requis' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always respond the same way — don't reveal if email exists
    const SUCCESS_MSG = 'Si cet email existe, un lien de réinitialisation a été envoyé.';

    if (!user) return res.json({ message: SUCCESS_MSG });

    // Generate raw token, store hashed version
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken = hashed;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

    try {
      await sendPasswordResetEmail(user.email, user.name, resetUrl);
    } catch (emailErr) {
      console.error('[ForgotPassword] Email error:', emailErr.message);
      // Clear token if email fails so user can retry
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ message: `Erreur email: ${emailErr.message}` });
    }

    res.json({ message: SUCCESS_MSG });
  } catch (err) { next(err); }
};

// POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Lien invalide ou expiré' });
    }

    user.password = password; // pre-save hook hashes it
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (err) { next(err); }
};
