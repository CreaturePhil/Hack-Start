import bodyParser from 'body-parser';
import chalk from 'chalk';
import compress from 'compression';
import connectMongo from 'connect-mongo';
import express from 'express';
import expressValidator from 'express-validator';
import favicon from 'serve-favicon';
import flash from 'express-flash';
import logger from 'morgan';
import lusca from 'lusca';
import methodOverride from 'method-override';
import passport from 'passport';
import path from 'path';
import mongoose from 'mongoose';
import session from 'express-session';

import config from './config';
import routes from './config/routes';

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
mongoose.connection.on('error', () => {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
});

/**
 * App configuration.
 */

// view engine setup
app.set('views', path.join(__dirname, 'views'));
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
    regexMatch(arg, regex) {
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
app.use((req, res, next) => {
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
app.use((req, res, next) => {
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
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    const { message } = err;
    res.render('error', { message, error: err });
  });
}

// production error handler
// no stacktraces leaked to user
if (app.get('env') === 'production') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    const { message } = err;
    res.render('error', { message, error: {} });
  });
}

/**
 * Start Express server.
 */

app.listen(config.port, () => {
  const env = chalk.green(app.get('env'));
  const port = chalk.magenta(config.port);
  console.log(`\n[${env}] Listening on port ${port}...\n`);
});

module.exports = app;
