const Card = require('../models/card');
const { NOT_FOUND, SERVER_ERROR } = require('../constants/errorStatus');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res
      .status(SERVER_ERROR)
      .send({
        message: 'На сервере произошла ошибка',
      }));
};

const createCard = (req, res) => {
  Card.create(req.body)
    .then((card) => res.status(201).send(card))
    .catch(() => res
      .status(SERVER_ERROR)
      .send({
        message: 'На сервере произошла ошибка',
      }));
};

const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => new Error('Карточка не найдена'))
    .then((deletedCard) => res.status(200).send(deletedCard))
    .catch((err) => {
      if (err.message === 'Карточка не найдена') {
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

const likeCard = (req, res) => {
  const cardId = req.params.cardId;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .then((updatedCard) => {
      if (!updatedCard) {
        return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      res.status(200).send(updatedCard);
    })
    .catch(() => res
      .status(SERVER_ERROR)
      .send({
        message: 'На сервере произошла ошибка',
      }));
};

const unlikeCard = (req, res) => {
  const cardId = req.params.cardId;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .then((updatedCard) => {
      if (!updatedCard) {
        return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      res.status(200).send(updatedCard);
    })
    .catch(() => res
      .status(SERVER_ERROR)
      .send({
        message: 'На сервере произошла ошибка',
      }));
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  unlikeCard,
};