var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cors = require('cors');
import redis = require('redis');
import config = require("./config");
const getConfig = config.getConfig();

process.env.NODE_ENV = 'development';
const app = express();
if (app.get('env') === 'development') {
  process.env.PORT = 9000;
}
else if (app.get('env') === 'production') {
  process.env.PORT = 9000;
}
console.log("listen on ", process.env.PORT);

var index = require('./routes/index');
var users = require('./routes/users');
const chatroom = require('./routes/chatroom');

app.use(cors());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(expressValidator()); // this line must be immediately after express.bodyParser()!
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('../build'));

const client = redis.createClient(getConfig.redis_port, getConfig.redis_host);
client.on('connect', function () {
  console.log('redis connected');
});
client.on("error", function (err) {
  console.log("redis Error " + err);
});
app.set('redis', client);

app.use('/', index);
app.use('/users', users);
app.use('/chatroom', chatroom);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json(err);
});

module.exports = app;
