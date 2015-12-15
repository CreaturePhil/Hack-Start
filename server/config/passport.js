import passport from 'passport';
import { Strategy } from 'passport-local';

import config from './index';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import query from '../query';
import User from '../models/User';

const findUserByIdQuery = `SELECT * FROM users WHERE id = $1`;
const findUserByUsernameIdQuery = `SELECT * FROM users WHERE uid = $1`;

/**
 * JWT authetication helper functions.
 */

export function createSalt() {
  return crypto.randomBytes(16).toString('hex');
};

export function createHash(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64).toString('hex');
};

export function isValidPassword(password, salt, userHash) {
  const hash = createHash(password, salt);

  return userHash === hash;
};

export function generateJWT(user) {
  // set expiration to 60 days
  const today = new Date();
  const exp = new Date(today).setDate(today.getDate() + 60);
  const payload = {
    id: user.id,
    username: user.username,
    exp: parseInt(exp / 1000),
  };

  return jwt.sign(payload, config.tokenSecret);
};

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  query(findUserByIdQuery, [id])
    .then(results => {
      done(null, results[0]);
    })
    .catch(err => console.error(err));
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

/**
 * Login Required middleware.
 */

export function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

var user = {};

var tmp = new Strategy((username, password, done) => {
  // find user
  if (!isValidPassword(password, user.salt, user.hash)) {
    return done(null, false, {message: 'nope'});
  }
  return done(null, user);
});

/**
 * Sign in using Username and Password.
 */

passport.use(new Strategy((username, password, done) => {
  query(findUserByUsernameIdQuery, [username.toLowerCase()])
    .then(results => {
      if (!results.length) {
        return done(null, false, { message: `User ${username} not found.` });
      }

      const user = results[0];

      if (!isValidPassword(password, user.salt, user.hash)) {
        return done(null, false, { message: 'Invalid username or password.' });
      }

      done(null, user);
    })
    .catch(err => console.error(err));
}));
