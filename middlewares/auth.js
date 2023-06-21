const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'SECRET');
  } catch (err) {
    res.status(401);
    return next(new UnauthorizedError('Неверный или истекший токен'));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
