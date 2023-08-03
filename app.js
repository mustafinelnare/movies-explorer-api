const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose
  .connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
    useNewUrlParser: true,
    autoIndex: true,
  })
  .then(() => {
    console.log('success');
  })
  .catch(() => {
    console.log('fail');
  });

app.listen(3000);
