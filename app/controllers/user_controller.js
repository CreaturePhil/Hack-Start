var passport = require('passport');

var User = require('../models/User');
var config = require('../../config');

module.exports = {
  getLogin: function(req, res) {
    if (req.user) return res.redirect('/');
    res.render('user/login', { title: 'Log In' });
  },

  postLogin: function(req, res, next) {
    req.assert('username', 'Only letters and numbers are allow in username.').regexMatch(/^[A-Za-z0-9]*$/);
    req.assert('username', 'Username cannot be more than 30 characters.').len(1, 30);
    req.assert('password', 'Password cannot be blank.').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/login');
    }

    passport.authenticate('local', function(err, user, info) {
      if (err) return next(err);
      if (!user) {
        req.flash('errors', { msg: info.message });
        return res.redirect('/login');
      }

      req.logIn(user, function(err) {
        if (err) return next(err);
        req.flash('success', { msg: 'Success! You are logged in.' });
        res.redirect('/');
      });
    })(req, res, next);
  },

  getLogout: function(req, res) {
    req.logout();
    req.flash('success', { msg: 'Success! You are logged out.' });
    res.redirect('/login');
  },

  getSignup: function(req, res) {
    if (req.user) return res.redirect('/');
    res.render('user/signup', { title: 'Sign Up' });
  },

  postSignup: function(req, res, next) {
    req.assert('username', 'Only letters and numbers are allow in username.').regexMatch(/^[A-Za-z0-9]*$/);
    req.assert('username', 'Username cannot be more than 30 characters.').len(1, 30);
    req.assert('password', 'Password must be at least 4 characters long.').len(4);

    var errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/signup');
    }

    var user = new User({
      uid: req.body.username.toLowerCase(),
      username: req.body.username,
      password: req.body.password
    });

    User.findOne({ uid: req.body.username.toLowerCase() }, function(err, existingUser) {
      if (existingUser) {
        req.flash('errors', { msg: 'Account with that username already exists.' });
        return res.redirect('/signup');
      }

      user.save(function(err) {
        if (err) return next(err);
        req.logIn(user, function(err) {
          if (err) return next(err);
          req.flash('success', { msg: 'Success! You account has been created.' });
          res.redirect('/');
        });
      });
    });
  }
};
