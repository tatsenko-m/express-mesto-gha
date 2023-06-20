const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  BAD_REQUEST, NOT_FOUND, SERVER_ERROR, UNAUTHORIZED,
} = require('../constants/errorStatus');
const { handleValidationErrors } = require('../helpers/errorHandlers');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res
      .status(SERVER_ERROR)
      .send({
        message: 'На сервере произошла ошибка',
      }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({
          message: 'Пользователь не найден',
        });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      handleValidationErrors(err, res);
    });
};

const createUser = (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({ ...req.body, password: hash }))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      handleValidationErrors(err, res);
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({
          message: 'Пользователь не найден',
        });
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          const token = jwt.sign({ _id: user._id }, 'SECRET', { expiresIn: '7d' });

          res
            .cookie('jwt', token, {
              maxAge: 3600000,
              httpOnly: true,
              sameSite: 'strict',
            });

          return res.status(200).send(user);
        });
    })
    .catch((err) => {
      if (err.message === 'Неправильные почта или пароль') {
        res.status(UNAUTHORIZED).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const getCurrentUserInfo = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({
          message: 'Пользователь не найден',
        });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      handleValidationErrors(err, res);
    });
};

const updateUserInfo = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  if (!name && !about) {
    return res.status(BAD_REQUEST).send({
      message: 'Переданы некорректные данные',
    });
  }

  return User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return res.status(200).send(updatedUser);
    })
    .catch((err) => {
      handleValidationErrors(err, res);
    });
};

const updateUserAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  if (!avatar) {
    return res.status(BAD_REQUEST).send({
      message: 'Переданы некорректные данные',
    });
  }

  return User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return res.status(200).send(updatedUser);
    })
    .catch((err) => {
      handleValidationErrors(err, res);
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  login,
  getCurrentUserInfo,
  updateUserInfo,
  updateUserAvatar,
};
