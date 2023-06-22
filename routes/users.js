const router = require('express').Router();
const {
  getUsers, getUserById, getCurrentUserInfo, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');
const { validateUser, validateUserAvatar, validateUserId } = require('../middlewares/validation');

router.get('/', getUsers);

router.get('/me', getCurrentUserInfo);

router.get('/:userId', validateUserId, getUserById);

router.patch('/me', validateUser, updateUserInfo);

router.patch('/me/avatar', validateUserAvatar, updateUserAvatar);

module.exports = router;
