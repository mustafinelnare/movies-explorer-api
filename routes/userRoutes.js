const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserId, updateProfile,
} = require('../controllers/users');

router.get('/me', getUserId);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().email(),
    email: Joi.string().min(2).max(30).required(),
  }),
}), updateProfile);

module.exports = router;
