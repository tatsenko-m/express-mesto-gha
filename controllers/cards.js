const Card = require('../models/card');
const { NOT_FOUND, SERVER_ERROR, FORBIDDEN } = require('../constants/errorStatus');
const { handleValidationErrors } = require('../helpers/errorHandlers');

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
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      handleValidationErrors(err, res);
    });
};

const deleteCardById = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({
          message: 'Карточка не найдена',
        });
      }
      if (String(req.user._id) !== String(card.owner)) {
        return res.status(FORBIDDEN).send({
          message: 'Доступ запрещен',
        });
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .then((deletedCard) => res.status(200).send(deletedCard));
    })
    .catch((err) => {
      handleValidationErrors(err, res);
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((updatedCard) => {
      if (!updatedCard) {
        return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      return res.status(200).send(updatedCard);
    })
    .catch((err) => {
      handleValidationErrors(err, res);
    });
};

const unlikeCard = (req, res) => {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((updatedCard) => {
      if (!updatedCard) {
        return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      return res.status(200).send(updatedCard);
    })
    .catch((err) => {
      handleValidationErrors(err, res);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  unlikeCard,
};
