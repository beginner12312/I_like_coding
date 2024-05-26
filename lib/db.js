var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var connect = {
	host : '127.0.0.1',
	user : 'user_codingrecipe',
	password : '1234',
	database : 'db_codingrecipe',
	port:"3306",
};

var db = mysql.createConnection(connect);

var sessionStore = new MySQLStore(connect);

module.exports = db;