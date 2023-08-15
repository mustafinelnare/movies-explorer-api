const express = require('express');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const routes = require('./routes/indexRoutes');
const limiter = require('./utils/limiter');

const app = express();
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000, DB_HOST, NODE_ENV } = process.env;
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(limiter);

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

app.use('/*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена.'));
});

app.use(routes);

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
