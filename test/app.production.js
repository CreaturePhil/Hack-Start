process.env.NODE_ENV = 'production';
delete require.cache[require.resolve('../server')];

var request = require('supertest');
var app = require('../server');

describe('GET / in production', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  });
});

describe('GET /404 in production', function() {
  it('should return 404 Page Not Found', function(done) {
    request(app)
      .get('/404')
      .expect(404, done);
  });
});
