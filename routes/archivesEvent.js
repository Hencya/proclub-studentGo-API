const router = require('express').Router();
const archEventContentController = require('../controllers/archEventController');
const { protect } = require('../middleware/auth');

router.post('/', protect, archEventContentController.createEventArchive);

router.get('/', protect, archEventContentController.getAllArchive);

router.delete('/:trigger_id ', protect, archEventContentController.deleteEventArchive);

module.exports = router;
