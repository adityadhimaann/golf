const Charity = require('../models/Charity');
const User = require('../models/User');
const { sendResponse } = require('../utils/apiResponse');

exports.getCharities = async (req, res) => {
  const { search, category, featured } = req.query;
  const filter = {};
  
  if (search) filter.name = { $regex: search, $options: 'i' };
  if (category) filter.category = category;
  if (featured === 'true') filter.is_featured = true;
  
  const charities = await Charity.find(filter).sort({ name: 1 });
  return sendResponse(res, 200, 'Charities fetched', charities);
};

exports.getFeaturedCharities = async (req, res) => {
  const charities = await Charity.find({ is_featured: true });
  return sendResponse(res, 200, 'Featured charities fetched', charities);
};

exports.getCharityById = async (req, res) => {
  const charity = await Charity.findById(req.params.id);
  if (!charity) {
    return sendResponse(res, 404, 'Charity not found');
  }
  return sendResponse(res, 200, 'Charity details fetched', charity);
};

// Admin only
exports.createCharity = async (req, res) => {
  const charity = await Charity.create(req.body);
  return sendResponse(res, 201, 'Charity created', charity);
};

exports.updateCharity = async (req, res) => {
  const charity = await Charity.findByIdAndUpdate(req.params.id, req.body, { 
    new: true,
    runValidators: true 
  });
  if (!charity) {
    return sendResponse(res, 404, 'Charity not found');
  }
  return sendResponse(res, 200, 'Charity updated', charity);
};

exports.deleteCharity = async (req, res) => {
  // Check if any users selection this charity
  const userCount = await User.countDocuments({ charity_id: req.params.id });
  if (userCount > 0) {
    return sendResponse(res, 400, 'Cannot delete charity as some users have selected it');
  }
  
  const charity = await Charity.findByIdAndDelete(req.params.id);
  if (!charity) {
    return sendResponse(res, 404, 'Charity not found');
  }
  
  return sendResponse(res, 200, 'Charity deleted successfully');
};

// Subscriber only action
exports.updateUserCharity = async (req, res) => {
  const { charity_id, charity_percentage } = req.body;
  
  const charity = await Charity.findById(charity_id);
  if (!charity) {
    return sendResponse(res, 404, 'Charity does not exist');
  }
  
  const user = await User.findByIdAndUpdate(req.user._id, {
    charity_id,
    charity_percentage
  }, { new: true });
  
  return sendResponse(res, 200, 'Charity selection updated successfully', {
    charity_id: user.charity_id,
    charity_percentage: user.charity_percentage
  });
};
