const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const errorHandler = require('./utils/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/indexRoutes');
const limiter = require('./utils/limiter');

const { PORT = 3000, DB_HOST, NODE_ENV } = process.env;

const app = express();

app.use(helmet());

app.use(cookieParser());

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

app.use(cors());

app.use(express.json());

app.use(requestLogger);

app.use(limiter);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
