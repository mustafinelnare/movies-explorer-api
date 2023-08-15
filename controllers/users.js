const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const getUserId = (req, res, next) => User.findById(req.user._id).then((item) => {
  if (!item) {
    throw new NotFoundError('Пользователь по указанному _id не найден.');
  }
  return res.status(200).send(item);
})
  .catch((error) => {
    if (error.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
    } else {
      next(error);
    }
  });

const updateProfile = (req, res, next) => User
  .findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
  .then((item) => {
    if (!item) {
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    }
    return res.status(200).send(item);
  })
  .catch((error) => {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
    } else {
      next(error);
    }
  });

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((newUser) => res.status(201).send(newUser))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else if (error.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует!'));
      } else {
        next(error);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret', { expiresIn: '7d' });
      return res.status(200).cookie('jwt', token, { maxAge: 3600000, httpOnly: true }).send({ data: email });
    })
    .catch(next);
};

const signOut = async (req, res, next) => {
  try {
    await res.status(200).clearCookie('jwt').send({ message: 'Вы вышли из своей учетной записи.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUserId,
  updateProfile,
  login,
  createUser,
  signOut,
};
