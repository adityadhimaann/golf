const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const auth = require('../middleware/auth.middleware');
const admin = require('../middleware/admin.middleware');

// Admin only routes
router.get('/overview', auth, admin, reportController.getOverview);
router.get('/subscribers', auth, admin, reportController.getSubscribersOverTime);
router.get('/prizes', auth, admin, reportController.getPrizesOverTime);
router.get('/charity', auth, admin, reportController.getCharityContributions);
router.get('/draw-stats', auth, admin, reportController.getDrawStatistics);
router.get('/activity', auth, admin, reportController.getRecentActivity);

module.exports = router;
