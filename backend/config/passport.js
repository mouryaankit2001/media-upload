const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');
const config = require('./config');

// Use Google OAuth2 Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientId,
      callbackURL: config.google.callbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract user info from Google profile
        const { sub: googleId, email, name, picture } = profile._json;
        
        // Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
          // Create new user if not exists
          user = await User.create({
            googleId,
            email,
            displayName: name,
            avatar: picture,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
          });
        } else if (!user.googleId) {
          // Update existing user with Google ID if not exists
          user.googleId = googleId;
          user.avatar = picture || user.avatar;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport; 