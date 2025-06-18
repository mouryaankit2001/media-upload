const User = require('../models/user.model');
const Media = require('../models/media.model');
const { AppError } = require('../utils/errorHandler');
const { sendSuccess, sendNotFound } = require('../utils/responseHandler');

// Get user profile
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-__v');
    
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    
    return sendSuccess(res, 200, 'User profile retrieved successfully', { user });
  } catch (error) {
    return next(new AppError('Failed to fetch user profile', 500));
  }
};

// Get user's media
exports.getUserMedia = async (req, res, next) => {
  try {
    const media = await Media.find({ owner: req.user.id })
      .sort({ createdAt: -1 });
    
    return sendSuccess(res, 200, 'User media retrieved successfully', { media });
  } catch (error) {
    return next(new AppError('Failed to fetch user media', 500));
  }
};

// Get public profile by ID
exports.getPublicProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('displayName avatar');
    
    if (!user) {
      return sendNotFound(res, 'User not found');
    }

    const publicMedia = await Media.find({
      owner: req.params.id,
      visibility: 'public',
    }).sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'User profile retrieved successfully', {
      user: {
        id: user.id,
        displayName: user.displayName,
        avatar: user.avatar,
      },
      media: publicMedia,
    });
  } catch (error) {
    return next(new AppError('Failed to fetch user profile', 500));
  }
}; 