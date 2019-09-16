const request = require('supertest');
var assert = require("assert");
const path = require('path');

describe('POST employee/authenticate', function() {
	var server;
	beforeEach(function () {
		server = require(path.join(__dirname, '../server'));
	});
	afterEach(function () {
		server.close();
	});
	it('responds with json', function(done) {
		request(server).post('/employee/authenticate')
		.set('Content-Type','application/json')
		.set('Authorization','Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1NjY4MjM1NzEsImV4cCI6MTU5ODM1OTU3MSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.i5tTEf7OwwKXiHi2yIXj3QGgLDHdnyzyLG1B9G1VzdI')
		.send({empEmail:'lbancosta@dxc.com',empPassword:'lbancosta'})
		.expect('Content-Type', /json/)
		.expect(200)
		.end(function(err, res) {
			if(err) return done(err);
			done();
		});
	});
	
	it('responds with json', function(done) {
		request(server).post('/employee/authenticate')
		.set('Content-Type','application/json')
		.set('Authorization','Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1NjY4MjM1NzEsImV4cCI6MTU5ODM1OTU3MSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.i5tTEf7OwwKXiHi2yIXj3QGgLDHdnyzyLG1B9G1VzdI')
		.send({empEmail:'lbancosta@dxc.com',empPassword:'bancosta'})
		.expect('Content-Type', /json/)
		.expect(400)
		.end(function(err, res) {
			if(err) return done(err);
			done();
		});
	});

});