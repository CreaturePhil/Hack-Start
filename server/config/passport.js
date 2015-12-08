import passport from 'passport';
import { Strategy } from 'passport-local';

import User from '../models/User';
import config from './index';
import {isValidPassword} from './auth';

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Sign in using Username and Password.
 */

var mongo = new Strategy({ usernameField: 'username' }, (username, password, done) => {
  User.findOne({ uid: username.toLowerCase() }, (err, user) => {
    if (!user) return done(null, false, { message: 'User ' + username + ' not found.' });
    user.comparePassword(password, (err, isMatch) => {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid username or password.' });
      }
    });
  });
});

var user = {};

var tmp = new Strategy((username, password, done) => {
  // find user
  if (!isValidPassword(password, user.salt, user.hash)) {
    return done(null, false, {message: 'nope'});
  }
  return done(null, user);
});

passport.use(mongo);

/**
 * Login Required middleware.
 */

export function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};
