process.env.NODE_ENV = 'development';

var request = require('supertest');
var app = require('../server');

describe('GET / in development', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  });
});

describe('GET /404 in development', function() {
  it('should return 404 Page Not Found', function(done) {
    request(app)
      .get('/404')
      .expect(404, done);
  });
});
