const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserId, updateProfile,
} = require('../controllers/users');

router.get('/me', getUserId);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), updateProfile);

module.exports = router;
