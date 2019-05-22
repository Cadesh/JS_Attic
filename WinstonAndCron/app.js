
// start with express https://expressjs.com/en/starter/generator.html
//npm i node-cron
//npm i winston
//npm i app-root-path
// to run on windows set DEBUG=myapp:* & npm start

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

const cron = require("node-cron");

var winston = require('./config/winston');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(morgan('combined'));
app.use(morgan('combined', { stream: winston.stream }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//run a cron task every minute
cron.schedule("* * * * *", function() {
      console.log("running a task every minute");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


 // include winston logging of errors
 //err.status - The HTTP error status code. If one is not already present, default to 500.
 //err.message - Details of the error.
 //req.originalUrl - The URL that was requested.
 //req.path - The path part of the request URL.
 //req.method - HTTP method of the request (GET, POST, PUT, etc.).
 //req.ip - Remote IP address of the request.
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);


  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
