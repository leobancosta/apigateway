const express = require('express');
// environment variables
process.env.NODE_ENV = 'development';
const login = require('./login');
const app = express();
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const config = require('./config/config.js');
var cors = require('cors')
app.use(cors());

const request = require('request');

const dashboard = require('./dashboard.js');

const fs = require('fs');
const path = require('path');

app.use(bodyParser.json());
app.use(function (req, res, next) {
	var bearerHeader = req.headers['authorization'];
	var token;
	req.authenticated = false;

	if (bearerHeader) {
		var bearer = bearerHeader.split(" ");
		token = bearer[1];
		jwt.verify(token, global.gConfig.secret, function (err, decoded) {
			console.log("3423545234");
			if (err) {
				console.log(err);
				req.authenticated = false;
				req.decoded = null;
				next(err);
			} else {
				console.log("33333");
				req.decoded = decoded;
				req.authenticated = true;
				next();
			}
		});
	} else {
		return res.status(403).json({ error: 'No credentials sent!' });
	}
});

app.get('/', (req, res) => {
	res.send('Oh Hi There!');
});

//will create folder and file for logging of request in /employee/register
// fs.mkdir(path.join(__dirname, '/empRegister'), (err) => {
// 	if (err) throw err;
// 	console.log('folder created');
// });

// fs.writeFile(path.join(__dirname, 'empRegister', 'logs.txt'), 'REQUEST LOGS++++', {}, err => {
// 	if (err) throw err;
// 	console.log('file created');

// });
app.post('/employee/register', (req, res, next) => {
	console.log('First API ...')

	// will append logs request
	fs.appendFile('/empRegister/logs.txt', '\n' + req.body.empEmail, function(err){
		if (err) throw err;
		console.log('file created');
	});

	let privateKey = fs.readFileSync('./config/jwt/private.pem', 'utf8');
	let empPasswd = jwt.sign({ "body": req.body.empEmail }, privateKey, { algorithm: 'HS256' });
	
	console.log('register API password : ' + empPasswd);

});


app.post('/employee/authenticate', (req, res, next) => {

	var pass = req.body.empPassword;
	console.log(pass);
	var resp = {};
	request("http://40.65.191.57:8080/dsoservice/employees/"+req.body.empEmail, { json: true }, (error, response, body) =>  {
		if (error) { return console.log(error); }
	}).on('data', function(data) {
		var microResp = JSON.parse(data);
		var empEmail = microResp.empEmail;
		var empPassword = microResp.empPassword;
		if(empPassword == pass){
			resp = {
				'authenticated' : true,
				'message' : 'Auhentication successful!'
			};
			console.log('decoded chunk: ' + data);
			res.status(200);
			res.send(resp);
		} else {
			resp = {
				'authenticated' : false,
				'message' : 'Invalid Email/Password!'
			};
			console.log('error decoded chunk: ' + data);
			res.status(400);
			res.send(resp);
		}

	}).on('response', function(response) {
		// unmodified http.IncomingMessage object
		response.on('data', function(data) {
		// compressed data as it is received
		console.log('received ' + data.length + ' bytes of compressed data')
		})
	});
	
});

app.post('/employee/login', function (req, res) {
	console.log('Login API ... Authenticate user : ' + req.body.empEmail);
	const employeeEmail = login.find(l => l.empEmail === req.body.empEmail);
	if (!employeeEmail) {
		res.status(401).send({
			success: false,
			message: 'Login failed'
		});
	}
	else {
		if (employeeEmail.empPassword === req.body.empPassword) {
			res.status(200).send({
				success: true,
				message: 'Login successful'
			});
		}
		else {
			res.send({
				success: false,
				message: 'Wrong password'
			});

		}
	}
});

app.get('/employee/dashboard', function (req, res) {
	res.send({
		success: true,
		message: "found",
		data: [dashboard]
	});
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	res.status(err.status || 500);
	res.send(err.name + ' - ' + err.message);
});

var server = app.listen(global.gConfig.node_port, () => console.log(`Listening on port  ${global.gConfig.node_port}`));

module.exports = server;