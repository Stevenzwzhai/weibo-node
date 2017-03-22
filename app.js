var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

/**
 * 数据库配置文件
 */
mongoose.connect('mongodb://localhost/mytest');
var db = mongoose.connection;
db.on('error', function(error) {
    console.log(error);
});
db.once('open',function(){
    //一次打开记录
    console.log("一次打开记录");
});

var connect = require('connect');
var SessionStore = require("session-mongoose")(connect);
var store = new SessionStore({
    url:"mongodb://localhost/session",
    ttl: 1800 //30分钟有效时间
});

var bodyParser = require('body-parser');


var index = require('./routes/index');
var register = require('./routes/register');
var login = require('./routes/login');
var users = require('./routes/users');
var blogs = require('./routes/blogs');
var uploadfile = require('./routes/file-upload');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'imooc',
    store: store,
    cookie:{maxAge:60000*30} //expire session in 10 seconds
}));

app.use('/', index);
app.use('/login', login);
app.use('/register', register);
app.use('/users', users);
app.use('/blogs', blogs);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, function () {
    var host = this.address().address;
    var port = this.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/public/favicon.ico'));

module.exports = app;
