var crypto = require('crypto');

var user = {};

function setPassword(password) {
  var salt = crypto.randomBytes(16).toString('hex');

  var hash = crypto.pbkdf2Sync(password, salt, 1000, 64).toString('hex');

  user.salt = salt;
  user.hash = hash;

  console.log(salt);
  console.log(hash);
}

setPassword('dem hoes');

function validPassword(password) {
  var hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64).toString('hex');
  return user.hash === hash;
}

console.log(validPassword('dem hoes'));
