var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require('mongoose')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var rolesRouter = require('./routes/roles');
var productsRouter = require('./routes/products');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter); // keep existing basic route if needed
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/roles', rolesRouter);
app.use('/roles', rolesRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/categories', require('./routes/categories'));
app.use('/products', productsRouter);

const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/NNPTUD-C3';

mongoose.connect(dbUri).then(() => {
  console.log('MongoDB connected:', dbUri);
}).catch((err) => {
  console.error('MongoDB connection error:', err.message);
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB event: connected');
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB event: disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB event error:', err.message);
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

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
