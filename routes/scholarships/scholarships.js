const router = require('express').Router();
const upload = require('../../utils/multer');
const scholarshipController = require('../../controllers/scholarships/scholarshipController');
const { protect } = require('../../middleware/auth');
const { checkID } = require('../../middleware/auth');

router.post('/', protect, upload.single('image_poster'), scholarshipController.post_create_scholarship);
router.get('/', scholarshipController.get_view_all_scholarship);
router.get('/search', scholarshipController.get_view_search_scholarship);
router.get('/5-latest', scholarshipController.get_view_5_latest_scholarship);
router.get('/slider', scholarshipController.get_view_slider_scholarship);
router.get('/:slug', checkID, scholarshipController.get_view_one_scholarship_by_slug);

module.exports = router;
