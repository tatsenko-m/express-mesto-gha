const express = require('express');
const router = require('./routes/index');

const app = express();

app.use(express.json());

app.use(router);

app.listen(3000, () => {
  console.log('Слушаю порт 3000');
});