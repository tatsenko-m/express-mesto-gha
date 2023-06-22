const router = require('express').Router();
const {
  getCards, createCard, deleteCardById, likeCard, unlikeCard,
} = require('../controllers/cards');
const { validateCard, validateCardId } = require('../middlewares/validation');

router.get('/', getCards);

router.post('/', validateCard, createCard);

router.delete('/:cardId', validateCardId, deleteCardById);

router.put('/:cardId/likes', validateCardId, likeCard);

router.delete('/:cardId/likes', validateCardId, unlikeCard);

module.exports = router;
