/**
 * Module dependencies.
 */

var bodyParser = require('body-parser');
var chalk = require('chalk');
var compress = require('compression');
var connectMongo = require('connect-mongo');
var express = require('express');
var expressValidator = require('express-validator');
var favicon = require('serve-favicon');
var flash = require('express-flash');
var logger = require('morgan');
var lusca = require('lusca');
var methodOverride = require('method-override');
var passport = require('passport');
var path = require('path');
var mongoose = require('mongoose');
var session = require('express-session');

var config = require('./config');
var routes = require('./config/routes');

/**
 * Create Mongo Store.
 */

var MongoStore = connectMongo(session);

/**
 * Create Express server.
 */

var app = express();

/**
 * Connect to MongoDB.
 */

mongoose.connect(config.db);
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
});

/**
 * App configuration.
 */

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

if (app.get('env') === 'development') {
  // don't minify html
  app.locals.pretty = true;

  // turn on console logging
  app.use(logger('dev'));
}

//app.use(favicon(path.join(__dirname, 'public/favicon.png')));
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator({
  customValidators: {
    regexMatch: function(arg, regex) {
      return arg.match(regex);
    }
  }
}));
app.use(methodOverride());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.sessionSecret,
  store: new MongoStore({ url: config.db, autoReconnect: true })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca({
  csrf: true,
  xframe: 'SAMEORIGIN',
  xssProtection: true
}));

// Make local variables avaliable in templates.
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

// static cache for one week
var week = 604800000;
app.use(express.static(path.join(__dirname, 'public'), { maxAge: week }));

/**
 * Routes setup.
 */

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/**
 * Error handlers
 */

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}

/**
 * Start Express server.
 */

app.listen(config.port, function() {
  var env = '\n[' + chalk.green(app.get('env')) + ']';
  var port = chalk.magenta(config.port);
  console.log(env + ' Listening on port ' + port + '...\n');
});

module.exports = app;
