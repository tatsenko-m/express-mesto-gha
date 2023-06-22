const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');
const router = require('./routes/index');
const { validateSignup, validateSignin } = require('./middlewares/validation');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.post('/signin', validateSignin, login);

app.post('/signup', validateSignup, createUser);

app.use(auth);

app.use(router);

app.listen(3000);

app.use(errors());

app.use(errorHandler);
