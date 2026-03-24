const Score = require('../models/Score');
const { sendResponse } = require('../utils/apiResponse');

exports.createScore = async (req, res) => {
  const { score, date_played } = req.body;
  const userId = req.user._id;

  // Rolling score logic: keep only latest 5
  const scoresCount = await Score.countDocuments({ user_id: userId });
  if (scoresCount >= 5) {
    const oldestScore = await Score.findOne({ user_id: userId }).sort({ date_played: 1 });
    await Score.findByIdAndDelete(oldestScore._id);
  }

  const newScore = await Score.create({
    user_id: userId,
    score,
    date_played
  });

  const allScores = await Score.find({ user_id: userId }).sort({ date_played: -1 });
  return sendResponse(res, 201, 'Score added successfully', allScores);
};

exports.getScores = async (req, res) => {
  const scores = await Score.find({ user_id: req.user._id }).sort({ date_played: -1 });
  return sendResponse(res, 200, 'User scores fetched', scores);
};

exports.updateScore = async (req, res) => {
  const { score, date_played } = req.body;
  
  const existingScore = await Score.findById(req.params.id);
  if (!existingScore) {
    return sendResponse(res, 404, 'Score not found');
  }

  // Ownership check
  if (existingScore.user_id.toString() !== req.user._id.toString()) {
    return sendResponse(res, 403, 'Unauthorized to update this score');
  }

  existingScore.score = score || existingScore.score;
  existingScore.date_played = date_played || existingScore.date_played;
  
  await existingScore.save();
  return sendResponse(res, 200, 'Score updated successfully', existingScore);
};

exports.deleteScore = async (req, res) => {
  const existingScore = await Score.findById(req.params.id);
  if (!existingScore) {
    return sendResponse(res, 404, 'Score not found');
  }

  // Ownership check
  if (existingScore.user_id.toString() !== req.user._id.toString()) {
    return sendResponse(res, 403, 'Unauthorized to delete this score');
  }

  await Score.findByIdAndDelete(req.params.id);
  return sendResponse(res, 200, 'Score deleted successfully');
};

// Admin only
exports.getAdminUserScores = async (req, res) => {
  const scores = await Score.find({ user_id: req.params.userId }).sort({ date_played: -1 });
  return sendResponse(res, 200, 'Scores fetched successfully', scores);
};

exports.adminUpdateScore = async (req, res) => {
  const { score, date_played } = req.body;
  const updatedScore = await Score.findByIdAndUpdate(req.params.id, {
    score,
    date_played
  }, { new: true });

  if (!updatedScore) {
    return sendResponse(res, 404, 'Score not found');
  }

  return sendResponse(res, 200, 'Score updated by admin', updatedScore);
};
