const mongoose = require('mongoose');
const User = require('../models/user');
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../constants/errorStatus');
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

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(BAD_REQUEST).send({
      message: 'Переданы некорректные данные',
    });
  }

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({
          message: 'Пользователь не найден',
        });
      }
      return res.status(200).send(user);
    })
    .catch(() => {
      res.status(SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
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
  updateUserInfo,
  updateUserAvatar,
};
