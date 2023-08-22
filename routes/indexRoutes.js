const router = require('express').Router();
const userRoutes = require('./userRoutes');
const movieRoutes = require('./movieRoutes');
const auth = require('../middlewares/auth');
const {
  login, createUser, signOut,
} = require('../controllers/users');

const { loginJoi, createUserJoi } = require('../utils/validation');

const NotFoundError = require('../errors/NotFoundError');

router.post('/signin', loginJoi, login);

router.post('/signup', createUserJoi, createUser);

router.get('/signout', auth, signOut);

router.use('/users', auth, userRoutes);
router.use('/movies', auth, movieRoutes);

router.use('/*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена.'));
});

module.exports = router;
