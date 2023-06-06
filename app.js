const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use(router);

app.listen(3000, () => {
  console.log('Слушаю порт 3000');
});