const express = require('express');
// environment variables
process.env.NODE_ENV = 'development';

const app = express();
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const config = require('./config/config.js');

var client = require('node-rest-client').Client;

app.use(function(req, res, next) {
	var bearerHeader = req.headers['authorization'];
	var token;
	req.authenticated = false;
	
	if (bearerHeader) {
		var bearer = bearerHeader.split(" ");
		token = bearer[1];
		jwt.verify(token, global.gConfig.secret, function (err, decoded){
            console.log("22222");
            if (err){
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

app.post('/employee/register', (req, res, next) => {
	console.log('First API ...')

	var args = {
		path: {"empEmail": req.body.empEmail},
		headers: { "Content-Type": "application/json" }
	};

	client.get("http://dso-services/employees?empEmail=${empEmail}", args, function (data, response) {
		console.log(data);
		console.log(response);
		if(response.statusCode != 200) {
			next(err)
		}
	});

	let privateKey = fs.readFileSync('./config/jwt/private.pem', 'utf8');
	let empPasswd = jwt.sign({ "body": req.body.empEmail }, privateKey, { algorithm: 'HS256'});

	var args1 = {
		data: {empId: req.body.empId, empEmail: req.body.empEmail, empPassword: empPasswd, empFirstname: req.body.empFirstname, empLastname: req.body.empLastname, deptId: req.body.deptId, roleId: req.body.roleId},
		headers: { "Content-Type": "application/json" }
	};
	
	client.post("http://dso-services/employees", args1, function (data, response) {
		console.log(data);
		console.log(response);

		if(response.statusCode != 200) {
			next(err);
		} else {
			res.send("Registration Successful!");
		}
	});
});


app.post('/employee/authemticate', (req, res, next) => {

	var args2 = {
		data: {empEmail: empEmail, empPassword: empPassword},
		headers: { "Content-Type": "application/json" }
	};

	client.post("http://dso-services/employees", args2, function (data, response) {
		console.log(data);
		console.log(response);

		if(response.statusCode != 200) {
			next(err);
		} else {
			res.send("Authentication Successful!");
		}
	});
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	res.status(err.status || 500);
	res.send(err.name + ' - ' + err.message);
});

app.listen(global.gConfig.node_port, () => console.log('Listening on port  ${global.gConfig.node_port}'));