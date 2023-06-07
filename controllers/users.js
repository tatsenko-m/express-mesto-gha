const User = require('../models/user');

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
  createUser,
};