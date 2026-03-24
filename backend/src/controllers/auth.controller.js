const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const { sendResponse } = require('../utils/apiResponse');

const generateToken = (userId, email, role) => {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

exports.register = async (req, res) => {
  const { email, password, full_name, charity_id, charity_percentage } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return sendResponse(res, 400, 'User already exists with this email');
  }

  const user = await User.create({
    email,
    password,
    full_name,
    charity_id,
    charity_percentage: charity_percentage || 10
  });

  const token = generateToken(user._id, user.email, user.role);

  // Don't send password
  const userObj = user.toObject();
  delete userObj.password;

  return sendResponse(res, 201, 'User registered successfully', {
    token,
    user: userObj
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password, user.password))) {
    return sendResponse(res, 401, 'Invalid email or password');
  }

  const token = generateToken(user._id, user.email, user.role);

  // Check subscription status
  const subscription = await Subscription.findOne({ user_id: user._id });

  const userObj = user.toObject();
  delete userObj.password;

  return sendResponse(res, 200, 'Logged in successfully', {
    token,
    user: userObj,
    subscription_status: subscription ? subscription.status : 'inactive'
  });
};

const DrawEntry = require('../models/DrawEntry');
const Winner = require('../models/Winner');
const CharityContribution = require('../models/CharityContribution');

exports.getMe = async (req, res) => {
  const subscription = await Subscription.findOne({ user_id: req.user._id });

  // Calculate stats
  const totalDrawsEntered = await DrawEntry.countDocuments({ user_id: req.user._id });
  const winnersList = await Winner.find({ user_id: req.user._id });
  const timesWon = winnersList.length;
  const totalWinnings = winnersList.reduce((sum, win) => sum + win.prize_amount, 0);

  const contributionsList = await CharityContribution.find({ user_id: req.user._id });
  const totalContributed = contributionsList.reduce((sum, con) => sum + con.amount, 0);

  const userObj = req.user.toObject();

  return sendResponse(res, 200, 'User profile fetched', {
    user: userObj,
    subscription_status: subscription ? subscription.status : 'inactive',
    subscription: subscription,
    stats: {
      totalDrawsEntered,
      timesWon,
      totalWinnings,
      totalContributed
    }
  });
};

exports.logout = async (req, res) => {
  // Stateless JWT doesn't need server side logout unless blacklisting
  return sendResponse(res, 200, 'Logged out successfully');
};

exports.forgotPassword = async (req, res) => {
  // Mock forgot password - in real app generate token and send email
  return sendResponse(res, 200, 'Password reset link sent to email');
};

exports.resetPassword = async (req, res) => {
  // Mock reset password
  return sendResponse(res, 200, 'Password reset successfully');
};
