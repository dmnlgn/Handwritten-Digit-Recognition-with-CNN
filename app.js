const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const argparse = require('argparse');
const model = require('./model');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

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

const parser = new argparse.ArgumentParser({
  add_help: true
});

parser.add_argument('--epochs', {
  type: 'int',
  default: 5,
  help: 'number of epochs'
})
parser.add_argument('--batch_size', {
  type: 'int',
  default: 128,
  help: 'batch size'
})
parser.add_argument('--model_save_path', {
  type: 'str',
  default: "file://./public/assets/model",
  help: 'path to which model will be saved'
})
parser.add_argument('--train_mode', {
  type: 'int',
  help: 'type of train model (1=true, 0=false)'
})

const args = parser.parse_args();

if (args.train_mode == 1) {
  console.log("\n[LOADING FULL DATA]");
  model.trainModel(args);
}

if (args.train_mode == 0) {
  console.log("\n[LOADING TRAIN AND TEST DATA]");
  model.trainModel(args);
}

module.exports = app;
