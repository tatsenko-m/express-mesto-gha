const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64805f5d3ba9d938dda5f3e8',
  };

  next();
});

app.use(router);

app.listen(3000, () => {
  console.log('Слушаю порт 3000');
});