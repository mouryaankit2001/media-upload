const dotenv = require('dotenv');
dotenv.config();

const config = {
  // Server configuration
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  
  // MongoDB configuration
  database: {
    uri: process.env.MONGO_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'development_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  },
  
  // Google OAuth configuration
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL
  },
  
  // AWS S3 configuration
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
    s3Bucket: process.env.S3_BUCKET
  },
  
  // Frontend URL
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  },
  
  // File upload limits
  fileUpload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'video/mp4', 'video/webm', 'video/mov', 'application/pdf']
  }
};

// Validate critical configuration
if (config.env === 'production') {
  if (!config.jwt.secret || config.jwt.secret === 'development_secret_key') {
    console.error('ERROR: JWT_SECRET is not set in production environment');
    process.exit(1);
  }
  
  if (!config.database.uri) {
    console.error('ERROR: MONGO_URI is not set in production environment');
    process.exit(1);
  }
}

module.exports = config; 