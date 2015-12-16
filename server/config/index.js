export default {
  connectionString: process.env.DATABASE_URL || 'postgres://username:password@localhost/database'

  port: process.env.PORT || 3000,

  sessionSecret: process.env.SESSION_SECRET || 'Your Session Secret goes here'
};
