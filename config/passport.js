var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../app/models/User');
var config = require('./index');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

/**
 * Sign in using Username and Password.
 */

passport.use(new LocalStrategy({ usernameField: 'username' }, function(username, password, done) {
  User.findOne({ uid: username.toLowerCase() }, function(err, user) {
    if (!user) return done(null, false, { message: 'User ' + username + ' not found.' });
    user.comparePassword(password, function(err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid username or password.' });
      }
    });
  });
}));

/**
 * Login Required middleware.
 */

exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};
