const express = require('express');

const router = express.Router();
const UserController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../utils/multer');
const cloudinary = require('../utils/cloudinary');

router.post('/Register', UserController.register);
router.post('/Login', UserController.login);
router.get('/Profile', protect, UserController.profile);
router.put('/Update', protect, upload.single('avatar'), UserController.update);
router.get('/getAvatar', protect, UserController.getAvatar);
router.get('/Logout', protect, UserController.logout);
router.post('/coba', upload.single('avatar'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      upload_preset: 'avatar',
    });
    res.json({ result });
  } catch (e) {
    res.json({ e });
  }
});

module.exports = router;
