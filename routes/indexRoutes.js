const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRoutes = require('./userRoutes');
const movieRoutes = require('./movieRoutes');
const auth = require('../middlewares/auth');
const {
  login, createUser, signOut,
} = require('../controllers/users');

const NotFoundError = require('../errors/NotFoundError');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.get('/signout', auth, signOut);

router.use('/users', auth, userRoutes);
router.use('/movies', auth, movieRoutes);

router.use('/*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена.'));
});

module.exports = router;
