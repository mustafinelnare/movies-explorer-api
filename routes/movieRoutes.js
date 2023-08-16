const router = require('express').Router();
const {
  getMovie,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const { createMovieJoi, deleteMovieJoi } = require('../utils/validation');

router.get('/', getMovie);
router.post('/', createMovieJoi, createMovie);
router.delete('/:movieId', deleteMovieJoi, deleteMovie);

module.exports = router;
