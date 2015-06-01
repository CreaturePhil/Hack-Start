var User = require('../app/models/User');
var assert = require('assert');

describe('User Model', function() {
  it('should create a new user', function(done) {
    var user = new User({
      uid: 'testuser',
      username: 'testuser',
      password: 'password'
    });
    user.save(function(err) {
      if (err) return done(err);
      done();
    });
  });

  it('should not create a user with the unique username', function(done) {
    var user = new User({
      uid: 'testuser',
      username: 'testuser',
      password: 'password'
    });
    user.save(function(err) {
      if (err) assert.deepEqual(err.code, 11000);
      done();
    });
  });

  it('should find user by username', function(done) {
    User.findOne({ uid: 'testuser' }, function(err, user) {
      if (err) return done(err);
      assert.deepEqual(user.uid, 'testuser');
      assert.deepEqual(user.username, 'testuser');
      done();
    });
  });

  it('should delete a user', function(done) {
    User.remove({ uid: 'testuser' }, function(err) {
      if (err) return done(err);
      done();
    });
  });
});
