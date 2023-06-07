const User = require('../models/user');
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../constants/errorStatus');

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
  User.findById(req.params.userId)
    .orFail(() => new Error('Пользователь не найден'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'Пользователь не найден') {
        res
          .status(NOT_FOUND)
          .send({
            message: err.message,
          });
      } else {
        res
          .status(SERVER_ERROR)
          .send({
            message: 'На сервере произошла ошибка',
          });
      }
    });
};

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
      }
      res
        .status(SERVER_ERROR)
        .send({
          message: 'На сервере произошла ошибка',
        });
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

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      res.status(200).send(updatedUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
      }
      res
        .status(SERVER_ERROR)
        .send({
          message: 'На сервере произошла ошибка',
        });
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

  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      res.status(200).send(updatedUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
      }
      res.status(SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};