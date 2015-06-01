var config = {};

config.db =  process.env.MONGODB || 'mongodb://localhost:27017/test';

config.port = process.env.PORT || 3000;

config.sessionSecret =  process.env.SESSION_SECRET || 'Your Session Secret goes here';

module.exports = config;
