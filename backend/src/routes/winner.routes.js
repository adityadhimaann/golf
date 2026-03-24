const express = require('express');
const router = express.Router();
const winnerController = require('../controllers/winner.controller');
const auth = require('../middleware/auth.middleware');
const admin = require('../middleware/admin.middleware');
const { upload } = require('../services/storage.service');

// Subscriber routes
router.get('/me', auth, winnerController.getMyWinnings);
router.post('/:id/upload-proof', auth, upload.single('proof'), winnerController.uploadProof);

// Admin routes
router.get('/admin', auth, admin, winnerController.adminGetAllWinners);
router.put('/admin/:id/verify', auth, admin, winnerController.adminVerifyWinner);
router.put('/admin/:id/payout', auth, admin, winnerController.adminProcessPayout);

module.exports = router;
