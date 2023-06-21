const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const router = require('./routes/index');
// const { regex } = require('./constants/regex');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use(cookieParser());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^(https?:\/\/)?(www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+$/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use(router);

app.listen(3000);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});
