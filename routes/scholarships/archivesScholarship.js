const router = require('express').Router();
const archScholarshipController = require('../../controllers/scholarships/archScholarshipController');
const { protect } = require('../../middleware/auth');

router.post('/', protect, archScholarshipController.post_scholarship_archive);
router.get('/', protect, archScholarshipController.get_view_all_archive);
// trigger_id yang Delete adalah arch id
router.delete('/:trigger_id', protect, archScholarshipController.delete_scholarship_archive);

module.exports = router;
