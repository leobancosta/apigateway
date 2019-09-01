var supertest = require("supertest");
var should = require("should");

var server = supertest.agent("http://localhost:3000");

describe("Base Unit Test", function () {
	it("should return to home page", function(done){
		server.get("/").expect("Content-Type", /json/).expect(200).end(function(err,res){
			res.status.should.equal(200);
			res.body.error.should.equal(false);
			done();
		});
	});

	it("should authenticate employee",function(done){
		server.post('/employee/authenticate').send({empEmail : 10, empPassword : 20}).expect("Content-type",/json/).expect(200).end(function(err,res){
			res.status.should.equal(200);
			res.body.error.should.equal(false);
			res.body.data.should.equal(30);
			done();
		});
	});
});