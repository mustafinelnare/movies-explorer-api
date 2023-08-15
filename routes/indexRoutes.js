const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRoutes = require('./userRoutes');
const movieRoutes = require('./movieRoutes');
const auth = require('../middlewares/auth');
const {
  login, createUser, signOut,
} = require('../controllers/users');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.get('/signout', auth, signOut);

router.use('/users', auth, userRoutes);
router.use('/movies', auth, movieRoutes);

module.exports = router;
