const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { NOT_FOUND } = require('../constants/errorStatus');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use((req, res) => {
  res.status(NOT_FOUND).json({ message: 'Не найдено' });
});

module.exports = router;
