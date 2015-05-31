var config = {};

config.db =  process.env.MONGODB || 'mongodb://localhost:27017/test';

config.port = process.env.PORT || 3000;

config.sendgrid = {
  user: process.env.SENDGRID_USER || 'hslogin',
  password: process.env.SENDGRID_PASSWORD || 'hspassword00'
};

config.sessionSecret =  process.env.SESSION_SECRET || 'Your Session Secret goes here';

module.exports = config;
