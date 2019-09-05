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
var client = require('node-rest-client').Client;
const dashboard = require('./dashboard.js');

const fs = require('fs');
const path = require('path');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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
	fs.appendFile(path.join(__dirname, '/empRegister', 'logs.txt'), '\n' + req.param.body, {}, err => {
		if (err) throw err;
		console.log('file created');
	});

	var args = {
		path: { "empEmail": req.body.empEmail },
		headers: { "Content-Type": "application/json" }
	};

	client.get("http://dso-services/employees?empEmail=${empEmail}", args, function (data, response) {
		console.log(data);
		console.log(response);
		if (response.statusCode != 200) {
			next(err)
		}
	});

	let privateKey = fs.readFileSync('./config/jwt/private.pem', 'utf8');
	let empPasswd = jwt.sign({ "body": req.body.empEmail }, privateKey, { algorithm: 'HS256' });

	var args1 = {
		data: { empId: req.body.empId, empEmail: req.body.empEmail, empPassword: empPasswd, empFirstname: req.body.empFirstname, empLastname: req.body.empLastname, deptId: req.body.deptId, roleId: req.body.roleId },
		headers: { "Content-Type": "application/json" }
	};

	client.post("http://dso-services/employees", args1, function (data, response) {
		console.log(data);
		console.log(response);

		if (response.statusCode != 200) {
			next(err);
		} else {
			res.send("Registration Successful!");
		}
	});
});


app.post('/employee/authenticate', (req, res, next) => {

	var args2 = {
		data: { empEmail: empEmail, empPassword: empPassword },
		headers: { "Content-Type": "application/json" }
	};

	client.post("http://dso-services/employees", args2, function (data, response) {
		console.log(data);
		console.log(response);

		if (response.statusCode != 200) {
			next(err);
		} else {
			res.send("Authentication Successful!");
		}
	});
});

app.post('/employee/login', function (req, res) {
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

app.listen(global.gConfig.node_port, () => console.log(`Listening on port  ${global.gConfig.node_port}`));