var express = require('express');

var isAuthenticated = require('./passport').isAuthenticated;

var mainController = require('../app/controllers/main_controller');
var userController = require('../app/controllers/user_controller');

var router = express.Router();

router.route('/')
  .get(mainController.getIndex);

router.route('/about')
  .get(mainController.getAbout);

router.route('/protected')
  .get(isAuthenticated, mainController.getProtected);

router.route('/login')
  .get(userController.getLogin)
  .post(userController.postLogin);

router.route('/logout')
  .get(userController.getLogout);

router.route('/signup')
  .get(userController.getSignup)
  .post(userController.postSignup);

module.exports = router;
