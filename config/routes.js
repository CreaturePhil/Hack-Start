var express = require('express');

var isAuthenticated = require('./passport').isAuthenticated;

var mainController = require('../app/controllers/main_controller');

var router = express.Router();

router.route('/')
  .get(mainController.index);

router.route('/about')
  .get(mainController.about);

router.route('/protected')
  .get(isAuthenticated, mainController.protected);

module.exports = router;
