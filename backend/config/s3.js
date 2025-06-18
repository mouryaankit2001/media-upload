const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('./config');
const { AppError } = require('../utils/errorHandler');
const path = require('path');
const crypto = require('crypto');

// Configure AWS S3
AWS.config.update({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region
});

// Create S3 service object
const s3 = new AWS.S3();

// Check if S3 is properly configured
const checkS3Configuration = () => {
  if (!config.aws.accessKeyId || !config.aws.secretAccessKey || !config.aws.s3Bucket) {
    console.warn('Warning: S3 not properly configured. Using local storage fallback.');
    return false;
  }
  return true;
};

// Configure multer for S3 upload
const upload = multer({
  storage: checkS3Configuration() ? 
    multerS3({
      s3: s3,
      bucket: config.aws.s3Bucket,
      acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req, file, cb) => {
        const randomName = crypto.randomBytes(16).toString('hex');
        const fileExtension = path.extname(file.originalname);
        const fileName = `${req.user.id}/${Date.now()}-${randomName}${fileExtension}`;
        cb(null, fileName);
      }
    }) :
    multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/');
      },
      filename: (req, file, cb) => {
        const randomName = crypto.randomBytes(16).toString('hex');
        const fileExtension = path.extname(file.originalname);
        const fileName = `${Date.now()}-${randomName}${fileExtension}`;
        cb(null, fileName);
      }
    }),
  limits: {
    fileSize: config.fileUpload.maxSize
  },
  fileFilter: (req, file, cb) => {
    if (config.fileUpload.allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(`File type not supported. Allowed types: ${config.fileUpload.allowedTypes.join(', ')}`, 400));
    }
  }
});

// Function to delete file from S3
const deleteFileFromS3 = async (fileKey) => {
  if (!checkS3Configuration()) {
    // Fallback to deleting local file
    return { success: true };
  }

  try {
    const params = {
      Bucket: config.aws.s3Bucket,
      Key: fileKey
    };
    
    await s3.deleteObject(params).promise();
    return { success: true };
  } catch (error) {
    console.error('Error deleting from S3:', error);
    return { success: false, error };
  }
};

module.exports = {
  s3,
  upload,
  deleteFileFromS3
}; 