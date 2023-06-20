const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { login, createUser } = require('./controllers/users');
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

app.use(cookieParser());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(router);

app.listen(3000);
