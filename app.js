var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var proxy = require("express-http-proxy");
var compression = require("compression");
var helmet = require("helmet")
var RateLimit = require("express-rate-limit");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(compression()); // Compress all routes
// content security policy, cross-site  "'self'"
app.use(
  helmet.contentSecurityPolicy({
    directives:{
      "script-src":["'self'","cdn.bootcdn.net"]
    }
  })
)

// rate limit, max 20 / minute
var limiter = RateLimit({
  windowMs: 1 * 60 * 1e3, // 1 minute
  max: 20
})
app.use(limiter)


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use("/api", proxy("gd.189.cn", {
  https: true,
  proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
    return new Promise(function(resolve, reject) {
      console.log(proxyReqOpts.headers["user-agent"])
      Object.assign (proxyReqOpts.headers, {
        "host": "gd.189.cn",
        "origin": "https://gd.189.cn",
        "referer": "https://gd.189.cn/hd/2021/cust/ssinfo.html"
      })
      //console.log(proxyReqOpts)
      resolve(proxyReqOpts);
    })
  },
  parseReqBody : false,
  //reqAsBuffer: true,
  //reqBodyEncoding: null,
  /*
  proxyReqBodyDecorator: function(bodyContent, srcReq) {
    console.log(bodyContent)
    console.log(srcReq.body)
    return bodyContent
  } 
  */ 
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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



module.exports = app;
