import config from '../config';
import passport from 'passport';
import query from '../query';
import { createSalt, createHash, generateJWT } from '../config/passport';

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
      return res.status(400).json(errors);
    }

    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json(info);
      }

      const token = generateJWT({
        id: user.id,
        username: user.username
      });

      return res.json({ token });
    })(req, res, next);

    return;

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
       return res.status(400).json(errors);
    }

    const findUserByUsernameIdQuery = `SELECT * FROM users WHERE uid = $1`;
    const insertUserQuery = `INSERT INTO
      users (uid, username, salt, hash, join_date)
      VALUES ($1, $2, $3, $4, $5)`;

    const salt = createSalt();
    const hash = createHash(req.body.password, salt);
    const uid = req.body.username.toLowerCase();

    query(findUserByUsernameIdQuery, [req.body.username.toLowerCase()])
      .then(results => {
          if (results.length) {
            return res.status(400).json({ msg: 'Account with that username already exists.' });
          }

          query(insertUserQuery, [uid, req.body.username, salt, hash, new Date()])
            .then(() => query(findUserByUsernameIdQuery, [uid]))
            .then(results => {
              const token = generateJWT({
                id: results[0].id,
                username: results[0].username
              });
              res.json({ token });
            })
            .catch(err => console.error(err));
      })
      .catch(err => console.error(err));

    return;

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
