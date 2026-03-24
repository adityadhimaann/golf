const express = require('express');
const router = express.Router();
const drawController = require('../controllers/draw.controller');
const auth = require('../middleware/auth.middleware');
const admin = require('../middleware/admin.middleware');

// Public routes
router.get('/', drawController.getDraws);
router.get('/:id', drawController.getDrawById);

// Admin routes
router.post('/', auth, admin, drawController.createDraw);
router.post('/:id/simulate', auth, admin, drawController.simulate);
router.post('/:id/publish', auth, admin, drawController.publish);
router.get('/admin/all', auth, admin, drawController.adminGetAllDraws);

module.exports = router;
