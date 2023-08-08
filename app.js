const express = require('express');
require('dotenv').config();

const { errors, celebrate, Joi } = require('celebrate');
const mongoose = require('mongoose');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');

const app = express();

const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000, DB_HOST, NODE_ENV } = process.env;
app.use(express.json());

mongoose
  .connect(NODE_ENV === 'production' ? DB_HOST : 'mongodb://0.0.0.0:27017/bitfilmsdb', {
    useNewUrlParser: true,
    autoIndex: true,
  })
  .then(() => {
    console.log('success');
  })
  .catch(() => {
    console.log('fail');
  });

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use('/users', auth, require('./routes/userRoutes'));
app.use('/movies', auth, require('./routes/movieRoutes'));

app.use('/*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена.'));
});

app.use(errorLogger);

app.use(errors());

app.use((error, req, res, next) => {
  const { statusCode = 500, message } = error;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
