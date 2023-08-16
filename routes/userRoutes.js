const router = require('express').Router();
const {
  getUserId, updateProfile,
} = require('../controllers/users');
const { updateProfileJoi } = require('../utils/validation');

router.get('/me', getUserId);

router.patch('/me', updateProfileJoi, updateProfile);

module.exports = router;
