const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');
const { validateIdParam, validate } = require('../utils/validators');

const router = express.Router();

// Get user profile
router.get('/profile', protect, userController.getUserProfile);

// Get user's media
router.get('/media', protect, userController.getUserMedia);

// Get public profile by ID
router.get('/:id', validateIdParam, validate, userController.getPublicProfile);

module.exports = router; 