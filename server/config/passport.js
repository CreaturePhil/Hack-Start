import Promise from 'bluebird';
import passport from 'passport';
import { Strategy } from 'passport-local';
import { randomBytes, pbkdf2 } from 'crypto';

import query from '../query';

const findUserByIdQuery = `SELECT * FROM users WHERE id = $1`;
const findUserByUsernameIdQuery = `SELECT * FROM users WHERE uid = $1`;

/**
 * Handling sessions.
 */

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  query(findUserByIdQuery, [id])
    .then(results => {
      done(null, results[0]);
    })
    .catch(err => console.error(err));
});

/**
 * Authetication helper functions.
 */

export const createSalt = () => randomBytes(32).toString('hex');

export const createHash = (password, salt) => {
  return new Promise((resolve, reject) => {
    pbkdf2(password, salt, 100000, 512, (err, key) => {
      if (err) return reject(err);

      const hash = key.toString('hex');
      resolve(hash);
    });
  });
};

export const isValidPassword = (password, salt, userHash) => {
  return new Promise((resolve, reject) => {
    createHash(password, salt).then(hash => resolve(hash === userHash));
  });
};

/**
 * Login Required middleware.
 */

export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

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

      isValidPassword(password, user.salt, user.hash)
        .then(valid => {
          if (!valid) {
            done(null, false, { message: 'Invalid username or password.' });
          } else {
            done(null, user);
          }
        });
    })
    .catch(err => console.error(err));
}));
