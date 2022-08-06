const createError = require('http-errors');
const express = require('express');
const api = require('./routes/api');
const logger = require('morgan');
const db = require('./models');

const app = express()

// app.use(cors({ origin: 'http://localhost:8081'}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
db.sequelize.sync();

app.use('/api', api);

app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  console.log('res.locals.error: ' + res.locals.error + '    \n  err: ' + err);
  res.send(err.status < 500 ? err : 'Internal Server Error');
});

module.exports = app;