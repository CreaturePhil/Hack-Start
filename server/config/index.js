export default {
  db:  process.env.MONGODB || 'mongodb://localhost:27017/test',

  port: process.env.PORT || 3000,

  sessionSecret: process.env.SESSION_SECRET || 'Your Session Secret goes here',

  tokenSecret: process.env.TOKEN_SECRET || 'Your Token Secret goes here'
};
