const Winner = require('../models/Winner');
const { sendResponse } = require('../utils/apiResponse');

exports.getMyWinnings = async (req, res) => {
  const winnings = await Winner.find({ user_id: req.user._id })
    .populate('draw_id', 'month draw_date jackpot_amount')
    .sort({ created_at: -1 });
    
  return sendResponse(res, 200, 'My winnings history fetched', winnings);
};

exports.uploadProof = async (req, res) => {
  const winner = await Winner.findById(req.params.id);
  if (!winner) {
    return sendResponse(res, 404, 'Winner record not found');
  }

  // Ownership check
  if (winner.user_id.toString() !== req.user._id.toString()) {
    return sendResponse(res, 403, 'Unauthorized to upload proof for this record');
  }

  if (!req.file) {
    return sendResponse(res, 400, 'Please upload a file');
  }

  winner.proof_url = `/uploads/proofs/${req.file.filename}`;
  winner.proof_status = 'pending';
  await winner.save();

  return sendResponse(res, 200, 'Proof uploaded successfully', winner);
};

// Admin only
exports.adminGetAllWinners = async (req, res) => {
  const { proof_status, payout_status } = req.query;
  const filter = {};
  
  if (proof_status) filter.proof_status = proof_status;
  if (payout_status) filter.payout_status = payout_status;

  const winners = await Winner.find(filter)
    .populate('user_id', 'full_name email')
    .populate('draw_id', 'month draw_date')
    .sort({ created_at: -1 });

  return sendResponse(res, 200, 'All winners fetched', winners);
};

exports.adminVerifyWinner = async (req, res) => {
  const { decision } = req.body;
  const winner = await Winner.findById(req.params.id);
  if (!winner) {
    return sendResponse(res, 404, 'Winner not found');
  }

  winner.proof_status = decision; // approved | rejected
  await winner.save();

  return sendResponse(res, 200, `Winner proof ${decision}`, winner);
};

exports.adminProcessPayout = async (req, res) => {
  const winner = await Winner.findById(req.params.id);
  if (!winner) {
    return sendResponse(res, 404, 'Winner not found');
  }

  if (winner.proof_status !== 'approved') {
    return sendResponse(res, 400, 'Cannot payout before proof approval');
  }

  winner.payout_status = 'paid';
  await winner.save();

  return sendResponse(res, 200, 'Payout marked as paid', winner);
};
