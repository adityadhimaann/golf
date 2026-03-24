const express = require('express');
const scoreController = require('../controllers/score.controller');
const auth = require('../middleware/auth.middleware');
const admin = require('../middleware/admin.middleware');
const checkSubscription = require('../middleware/subscription.middleware');
const validate = require('../middleware/validate.middleware');
const { scoreSchema } = require('../validations/score.validation');

const router = express.Router();

// Subscriber routes
router.post('/', auth, checkSubscription, validate(scoreSchema), scoreController.createScore);
router.get('/', auth, scoreController.getScores);
router.put('/:id', auth, checkSubscription, validate(scoreSchema), scoreController.updateScore);
router.delete('/:id', auth, checkSubscription, scoreController.deleteScore);

// Admin routes
router.get('/admin/:userId', auth, admin, scoreController.getAdminUserScores);
router.put('/admin/:id', auth, admin, validate(scoreSchema), scoreController.adminUpdateScore);

module.exports = router;
