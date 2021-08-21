const express = require('express');
const upload = require('../utils/multer');

const eventController = require('../controllers/eventController');

const router = express.Router();

router.post('/', upload.fields([
  { name: 'poster', maxCount: 100 },
  { name: 'image1', maxCount: 100 },
  { name: 'image2', maxCount: 100 },
  { name: 'image3', maxCount: 100 },
  { name: 'image4', maxCount: 100 },
  { name: 'logo', maxCount: 100 },
]), eventController.createEventContent);
// router.get('/:slug/:userId', eventController.geteventBySlug);
// router.get('/5-latest', eventController.getFiveLastestEvent);

module.exports = router;
