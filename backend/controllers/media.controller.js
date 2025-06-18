const Media = require('../models/media.model');
const { deleteFileFromS3 } = require('../config/s3');
const { AppError } = require('../utils/errorHandler');
const { sendSuccess, sendCreated, sendNotFound, sendForbidden } = require('../utils/responseHandler');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.getAllMedia = async (req, res, next) => {
  try {
    const { visibility, page = 1, limit = 10 } = req.query;
    const query = {};
    let userId = null;

    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, config.jwt.secret);
        userId = decoded.id;
        
        if (visibility === 'private') {
          query.owner = userId;
          query.visibility = 'private';
        } else if (visibility === 'all' && userId) {
          query.$or = [
            { visibility: 'public' },
            { visibility: 'private', owner: userId }
          ];
        } else {
          query.visibility = 'public';
        }
      } catch (error) {
        query.visibility = 'public';
      }
    } else {
      query.visibility = 'public';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const media = await Media.find(query)
      .populate('owner', 'displayName avatar email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Media.countDocuments(query);

    return sendSuccess(res, 200, 'Media retrieved successfully', {
      media,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    return next(new AppError('Failed to fetch media', 500));
  }
};

exports.getMediaById = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id)
      .populate('owner', 'displayName avatar email');

    if (!media) {
      return sendNotFound(res, 'Media not found');
    }

    if (media.visibility === 'private') {
      let isOwner = false;

      if (req.headers.authorization) {
        try {
          const token = req.headers.authorization.split(' ')[1];
          const decoded = jwt.verify(token, config.jwt.secret);
          
          isOwner = media.owner._id.toString() === decoded.id;
        } catch (error) {
          // Token invalid
        }
      }

      if (!isOwner) {
        return sendForbidden(res, 'Not authorized to view this media');
      }
    }

    return sendSuccess(res, 200, 'Media retrieved successfully', { media });
  } catch (error) {
    return next(new AppError('Failed to fetch media', 500));
  }
};

exports.uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('Please upload a file', 400));
    }

    const { title, description, visibility } = req.body;
    
    const media = await Media.create({
      title,
      description,
      visibility: visibility || 'private',
      fileUrl: req.file.location,
      fileKey: req.file.key,
      fileType: req.file.mimetype,
      size: req.file.size,
      owner: req.user.id,
    });

    return sendCreated(res, 'Media uploaded successfully', {
      media: {
        id: media.id,
        title: media.title,
        description: media.description,
        fileUrl: media.fileUrl,
        fileType: media.fileType,
        visibility: media.visibility,
        createdAt: media.createdAt,
      }
    });
  } catch (error) {
    return next(new AppError('Upload failed', 500));
  }
};

exports.updateMedia = async (req, res, next) => {
  try {
    let media = await Media.findById(req.params.id);

    if (!media) {
      return sendNotFound(res, 'Media not found');
    }

    if (media.owner.toString() !== req.user.id) {
      return sendForbidden(res, 'Not authorized to update this media');
    }

    const { title, description, visibility } = req.body;
    
    media = await Media.findByIdAndUpdate(
      req.params.id,
      {
        title: title || media.title,
        description: description !== undefined ? description : media.description,
        visibility: visibility || media.visibility,
      },
      { new: true }
    );

    return sendSuccess(res, 200, 'Media updated successfully', {
      media: {
        id: media.id,
        title: media.title,
        description: media.description,
        fileUrl: media.fileUrl,
        fileType: media.fileType,
        visibility: media.visibility,
        updatedAt: media.updatedAt,
      }
    });
  } catch (error) {
    return next(new AppError('Update failed', 500));
  }
};

exports.deleteMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return sendNotFound(res, 'Media not found');
    }

    if (media.owner.toString() !== req.user.id) {
      return sendForbidden(res, 'Not authorized to delete this media');
    }

    const deleteResult = await deleteFileFromS3(media.fileKey);
    
    if (!deleteResult.success) {
      console.error('S3 deletion warning:', deleteResult.error);
    }

    await Media.findByIdAndDelete(req.params.id);

    return sendSuccess(res, 200, 'Media deleted successfully');
  } catch (error) {
    return next(new AppError('Delete failed', 500));
  }
};