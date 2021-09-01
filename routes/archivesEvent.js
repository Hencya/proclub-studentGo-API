const router = require('express').Router();
const archEventContentController = require('../controllers/archEventController');
const { protect } = require('../middleware/auth');

router.post('/', protect, archEventContentController.createEventArchive);

router.get('/', protect, archEventContentController.getAllArchive);
// trigger_id yang Delete adalah arch id
router.delete('/:trigger_id', protect, archEventContentController.deleteEventArchive);

module.exports = router;
