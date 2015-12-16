import config from '../config';
import passport from 'passport';
import query from '../query';
import { createSalt, createHash } from '../config/passport';

var User = require('../models/User');

module.exports = {
  getLogin(req, res) {
    if (req.user) return res.redirect('/');
    res.render('user/login', { title: 'Log In' });
  },

  postLogin(req, res, next) {
    req.assert('username', 'Only letters and numbers are allow in username.').regexMatch(/^[A-Za-z0-9]*$/);
    req.assert('username', 'Username cannot be more than 30 characters.').len(1, 30);
    req.assert('password', 'Password cannot be blank.').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/login');
    }

    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        req.flash('errors', { msg: info.message });
        return res.redirect('/login');
      }

      req.logIn(user, (err) => {
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

  postSignup(req, res, next) {
    req.assert('username', 'Only letters and numbers are allow in username.').regexMatch(/^[A-Za-z0-9]*$/);
    req.assert('username', 'Username cannot be more than 30 characters.').len(1, 30);
    req.assert('password', 'Password must be at least 4 characters long.').len(4);

    var errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/signup');
    }

    const findUserByUsernameIdQuery = `SELECT * FROM users WHERE uid = $1`;
    const insertUserQuery = `INSERT INTO
      users (uid, username, salt, hash, join_date)
      VALUES ($1, $2, $3, $4, $5)`;

    const salt = createSalt();
    const uid = req.body.username.toLowerCase();

    query(findUserByUsernameIdQuery, [uid])
      .then(results => {
        if (results.length) {
          const msg = 'Account with that username already exists.';
          req.flash('errors', { msg });
          res.redirect('/signup');
          throw new Error(msg);
        }

        return createHash(req.body.password, salt);
        /*query(insertUserQuery, [uid, req.body.username, salt, hash, new Date()])
        .then(() => query(findUserByUsernameIdQuery, [uid]))
        .then(results => {
          req.logIn(results[0], function(err) {
            if (err) return next(err);
            req.flash('success', { msg: 'Success! You account has been created.' });
            res.redirect('/');
          });
        })
        .catch(err => console.error(err));*/
      })
      .then(hash => query(insertUserQuery, [uid, req.body.username, salt, hash, new Date()]))
      .then(() => query(findUserByUsernameIdQuery, [uid]))
      .then(results => {
        req.logIn(results[0], (err) => {
          if (err) return next(err);
          req.flash('success', { msg: 'Success! You account has been created.' });
          res.redirect('/');
        });
      })
      .catch(err => console.error(err));
  }
};
