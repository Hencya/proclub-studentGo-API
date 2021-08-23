const express = require('express');
const upload = require('../utils/multer');
const { protect, checkID } = require('../middleware/auth');

const eventController = require('../controllers/eventController');

const router = express.Router();

router.post('/', protect, upload.fields([
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
router.get('/:slug', checkID, eventController.getEventContentBySlug);
router.get('/tags/:tags', eventController.getEventContentByTags);
router.get('/confirm/:slug', protect, eventController.getEventContentBySlugConfirm);
router.post('/purchase/checkout/:slug', protect, eventController.createCheckoutEvent);

module.exports = router;
