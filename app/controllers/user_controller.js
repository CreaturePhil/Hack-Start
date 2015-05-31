/**
 * Module dependencies.
 */

var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');

var User = require('../models/User');
var config = require('../config/');
