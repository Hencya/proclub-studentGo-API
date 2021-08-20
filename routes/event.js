const express = require('express');
const upload = require('../utils/multer');

const eventController = require('../controllers/eventController');

const router = express.Router();

router.post('/', upload.array('images'),
  eventController.createeventContent);

module.exports = router;
