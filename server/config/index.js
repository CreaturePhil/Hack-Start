export default {
  connectionString: process.env.DATABASE_URL || 'postgres://username:password@localhost/database',

  mongodb: process.env.MONGODB || 'mongodb://localhost:27017/test',

  port: process.env.PORT || 3000,

  sessionSecret: process.env.SESSION_SECRET || 'Your Session Secret goes here'
};
