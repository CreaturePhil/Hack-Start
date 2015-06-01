/**
 * Module dependencies.
 */

var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');

var User = require('../models/User');
var config = require('../../config');

module.exports = {
  login: function(req, res) {
    if (req.user) return res.redirect('/');
    res.render('user/login', {
      title: 'Log In'
    });
  },

  logIntoAccount: function(req, res, next) {
    req.assert('username', 'Only letters and numbers are allow in username.').regexMatch(/^[A-Za-z0-9]*$/);
    req.assert('username', 'Username cannot be more than 30 characters.').len(1, 30);
    req.assert('password', 'Password cannot be blank').notEmpty();
    
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

  logout: function(req, res) {
    req.logout();
    res.redirect('/');
  },

  signup: function(req, res) {
    if (req.user) return res.redirect('/');
    res.render('user/signup', { title: 'Sign Up' });
  }
};
