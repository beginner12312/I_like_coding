var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var connect = {
	host : '192.168.0.107',
	user : 'admin',
	password : 'admin',
	database : 'express',
	dateStrings: "date",
};

var db = mysql.createConnection(connect);

var sessionStore = new MySQLStore(connect);

module.exports = db;