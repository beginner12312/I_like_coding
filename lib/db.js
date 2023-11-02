var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var connect = {
	host : '',
	user : '',
	password : '',
	database : '',
	dateStrings: "date",
};

var db = mysql.createConnection(connect);

var sessionStore = new MySQLStore(connect);

module.exports = db;