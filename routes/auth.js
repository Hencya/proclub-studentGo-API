const router = require('express').Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup_post);
router.get('/', authController.get_view_all_users);

module.exports = router;
