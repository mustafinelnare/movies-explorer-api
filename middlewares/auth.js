const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    next(new UnauthorizedError('Необходима авторизация!'));
    return;
  }

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret');
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация!'));
  }

  req.user = payload;

  next();
};
