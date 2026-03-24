const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Score = require('../models/Score');
const Winner = require('../models/Winner');
const { sendResponse } = require('../utils/apiResponse');

exports.getMe = async (req, res) => {
  const subscription = await Subscription.findOne({ user_id: req.user._id });
  
  const userObj = req.user.toObject();
  
  return sendResponse(res, 200, 'User profile fetched', {
    user: userObj,
    subscription
  });
};

exports.updateMe = async (req, res) => {
  const { full_name, charity_id, charity_percentage } = req.body;
  
  const user = await User.findByIdAndUpdate(req.user._id, {
    full_name: full_name || req.user.full_name,
    charity_id: charity_id || req.user.charity_id,
    charity_percentage: charity_percentage || req.user.charity_percentage
  }, { new: true, runValidators: true });
  
  return sendResponse(res, 200, 'Profile updated successfully', user);
};

// Admin only
exports.adminGetAllUsers = async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const filter = {};
  
  if (search) {
    filter.$or = [
      { email: { $regex: search, $options: 'i' } },
      { full_name: { $regex: search, $options: 'i' } }
    ];
  }

  const users = await User.find(filter)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ created_at: -1 });

  const count = await User.countDocuments(filter);

  // For each user, get subscription status
  const usersWithSubs = await Promise.all(users.map(async (user) => {
    const sub = await Subscription.findOne({ user_id: user._id });
    return {
      ...user.toObject(),
      subscription_status: sub ? sub.status : 'none'
    };
  }));

  return sendResponse(res, 200, 'Users fetched', {
    users: usersWithSubs,
    totalPages: Math.ceil(count / limit),
    currentPage: page
  });
};

exports.adminGetUserDetail = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return sendResponse(res, 404, 'User not found');

  const subscription = await Subscription.findOne({ user_id: user._id });
  const scores = await Score.find({ user_id: user._id }).sort({ date_played: -1 });
  const winners = await Winner.find({ user_id: user._id }).sort({ created_at: -1 });

  return sendResponse(res, 200, 'User full detail fetched', {
    user,
    subscription,
    scores,
    winners
  });
};

exports.adminUpdateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user) return sendResponse(res, 404, 'User not found');
  
  return sendResponse(res, 200, 'User updated by admin', user);
};
