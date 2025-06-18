const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { upload } = require('../config/s3');
const mediaController = require('../controllers/media.controller');
const { mediaValidationRules, validateIdParam, validate } = require('../utils/validators');

const router = express.Router();

// Get all media (with visibility filtering)
router.get('/', mediaController.getAllMedia);

// Get single media by ID
router.get('/:id', validateIdParam, validate, mediaController.getMediaById);

// Upload media
router.post(
  '/',
  protect,
  upload.single('file'),
  mediaValidationRules,
  validate,
  mediaController.uploadMedia
);

// Update media
router.patch(
  '/:id',
  protect,
  validateIdParam,
  mediaValidationRules,
  validate,
  mediaController.updateMedia
);

// Delete media
router.delete(
  '/:id',
  protect,
  validateIdParam,
  validate,
  mediaController.deleteMedia
);

module.exports = router; 