const User = require('../models/user');
const { NOT_FOUND, SERVER_ERROR } = require('../constants/errorStatus');

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
    .catch(() => res
      .status(SERVER_ERROR)
      .send({
        message: 'На сервере произошла ошибка',
      }));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
};