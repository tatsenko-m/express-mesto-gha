const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res
      .status(500)
      .send({
        message: 'На сервере произошла ошибка',
      }));
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => new Error('Не найдено'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'Не найдено') {
        res
          .status(404)
          .send({
            message: err.message,
          });
      } else {
        res
          .status(500)
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
      .status(500)
      .send({
        message: 'На сервере произошла ошибка',
      }));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
};