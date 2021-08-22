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
router.get('/', eventController.getAllEventContentSkipFive);
router.get('/search', eventController.getEventContentByTitleWithSearching);
router.get('/5-latest', eventController.getLatestEventContent);
// router.post('/checkout', eventController.createCheckoutEvent);
router.get('/confirm/:slug', eventController.getEventContentBySlugConfirm);
router.get('/:tags', eventController.getEventContentByTags);
router.get('/:slug/:userId', eventController.getEventContentBySlug);

module.exports = router;
