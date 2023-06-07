const { BAD_REQUEST, SERVER_ERROR } = require('../constants/errorStatus');

const handleValidationErrors = (err, res) => {
  if (err.name === 'ValidationError') {
    return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
  }
  return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
};

module.exports = {
  handleValidationErrors,
};
