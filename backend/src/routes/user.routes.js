const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const admin = require('../middleware/admin.middleware');

// Subscriber routes
router.get('/me', auth, userController.getMe);
router.put('/me', auth, userController.updateMe);

// Admin routes
router.get('/admin', auth, admin, userController.adminGetAllUsers);
router.get('/admin/:id', auth, admin, userController.adminGetUserDetail);
router.put('/admin/:id', auth, admin, userController.adminUpdateUser);

module.exports = router;
