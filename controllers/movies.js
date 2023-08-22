const Movie = require('../models/movies');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

const getMovie = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .then((movie) => {
      res.status(200).send(movie);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;

  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((newMovie) => res.status(201).send(newMovie))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма.'));
      } else {
        next(error);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  return Movie.findById(movieId).then((movie) => {
    if (!movie) {
      throw new NotFoundError('Фильм с указанным _id не найден.');
    } else if (movie.owner.toString() !== req.user._id) {
      throw new ForbiddenError('Невозможно удалить фильм!');
    }
    return Movie.findByIdAndRemove(movieId);
  })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным _id не найден.');
      }
      res.send(movie);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Некорректные данные _id'));
      } else {
        next(error);
      }
    });
};

module.exports = {
  getMovie,
  createMovie,
  deleteMovie,
};
