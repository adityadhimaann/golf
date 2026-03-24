const drawService = require('../services/draw.service');
const Draw = require('../models/Draw');
const { sendResponse } = require('../utils/apiResponse');

exports.getDraws = async (req, res) => {
  const draws = await Draw.find({ status: 'published' }).sort({ draw_date: -1 });
  return sendResponse(res, 200, 'Published draws fetched', draws);
};

exports.getDrawById = async (req, res) => {
  const draw = await Draw.findById(req.params.id);
  if (!draw || draw.status !== 'published') {
    return sendResponse(res, 404, 'Draw not found or not published');
  }
  return sendResponse(res, 200, 'Draw details fetched', draw);
};

// Admin only
exports.adminGetAllDraws = async (req, res) => {
  const draws = await Draw.find().sort({ draw_date: -1 });
  return sendResponse(res, 200, 'All draws fetched', draws);
};

exports.createDraw = async (req, res) => {
  const { month, draw_date, mode } = req.body;
  const draw = await drawService.initializeDraw(month, draw_date, mode);
  return sendResponse(res, 201, 'Draw initialization pending', draw);
};

exports.simulate = async (req, res) => {
  const simulation = await drawService.simulateDraw(req.params.id);
  return sendResponse(res, 200, 'Draw simulation completed', simulation);
};

exports.publish = async (req, res) => {
  const draw = await Draw.findById(req.params.id);
  if (!draw || draw.status !== 'simulated') {
    return sendResponse(res, 400, 'Draw must be simulated before publishing');
  }
  
  const winners = await drawService.publishDraw(req.params.id);
  return sendResponse(res, 200, 'Draw results published successfully', winners);
};
