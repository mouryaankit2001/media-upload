const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user.model');
const config = require('../config/config');
const { AppError } = require('../utils/errorHandler');
const { sendSuccess, sendUnauthorized } = require('../utils/responseHandler');

const client = new OAuth2Client(config.google.clientId);

const signToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

exports.googleAuthCallback = (req, res) => {
  try {
    const token = signToken(req.user.id);
    res.redirect(`${config.frontendUrl}/auth/success?token=${token}`);
  } catch (error) {
    console.error('Google auth callback error:', error);
    res.redirect(`${config.frontendUrl}/login?error=authentication_failed`);
  }
};

exports.verifyGoogleToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return sendUnauthorized(res, 'Token is required');
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: config.google.clientId,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        googleId,
        email,
        displayName: name,
        avatar: picture,
        firstName: payload.given_name,
        lastName: payload.family_name,
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    const jwtToken = signToken(user.id);

    return sendSuccess(res, 200, 'Authentication successful', {
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    return next(new AppError('Authentication failed', 401));
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendUnauthorized(res, 'Not authenticated');
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findById(decoded.id).select('-__v');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    return sendSuccess(res, 200, 'User data retrieved successfully', {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        role: user.role,
      }
    });
  } catch (error) {
    return next(new AppError('Authentication failed', 401));
  }
}; 