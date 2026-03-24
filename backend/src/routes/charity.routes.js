const express = require('express');
const router = express.Router();
const charityController = require('../controllers/charity.controller');
const auth = require('../middleware/auth.middleware');
const admin = require('../middleware/admin.middleware');
const validate = require('../middleware/validate.middleware');
const { charitySchema, userCharitySelectionSchema } = require('../validations/charity.validation');

// Public routes
router.get('/', charityController.getCharities);
router.get('/featured', charityController.getFeaturedCharities);
router.get('/:id', charityController.getCharityById);

// Subscriber routes
router.put('/users/charity', auth, validate(userCharitySelectionSchema), charityController.updateUserCharity);

// Admin routes
router.post('/', auth, admin, validate(charitySchema), charityController.createCharity);
router.put('/:id', auth, admin, validate(charitySchema), charityController.updateCharity);
router.delete('/:id', auth, admin, charityController.deleteCharity);

module.exports = router;
