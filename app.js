var express         = require('express'),
    path            = require('path'),
    favicon         = require('serve-favicon'),
    logger          = require('morgan'),
    ejs             = require('ejs'),
    cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    passport        = require('passport');

//MODELS
require('./server/models/Projects');
require('./server/models/Comments');
require('./server/models/Users');

//CONFIG
require('./server/config/passport');

mongoose.connect('mongodb://localhost/news');

var routes = require('./server/routes/index');
var users = require('./server/routes/users');

// API CONTROLLERS 
require('./server/controllers/authentication');
require('./server/controllers/projects');


var app = express();



// view engine setup
// app.set('views', path.join(__dirname, 'client'));
// app.set('view engine', 'html');
// app.engine('html',require('ejs').renderFile);

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/client/assets/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/user', express.static(path.join(__dirname, 'client/app-user')));
app.use('/contributor', express.static(path.join(__dirname, 'client/app-contributor')));
app.use('/admin', express.static(path.join(__dirname, 'client/app-admin')));
app.use('/set', express.static(path.join(__dirname, 'client/app-set')));
app.use('/', express.static(path.join(__dirname, 'client')));
// app.use(express.static(path.join(__dirname, 'client')));
app.use(passport.initialize());

app.use('/api', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
