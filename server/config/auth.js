import config from './index';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

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
