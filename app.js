var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
const argon2 = require('argon2');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var dbConnectionPool = mysql.createPool({host:'localhost',database:'meetups'});
app.use(function(req,res,next)
{
  req.pool = dbConnectionPool;
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
