const router = require('express').Router();
const coursesController = require('../../controllers/courses/courseController');
const upload = require('../../utils/multer');
const { protect } = require('../../middleware/auth');
const { checkID } = require('../../middleware/auth');

router.post('/', upload.single('course_poster'), coursesController.post_create_course);
router.get('/', coursesController.get_view_all_course);
router.get('/search', coursesController.get_view_search_course);
router.get('/homepage/slider/poster', coursesController.get_homepage_slider_poster);
router.get('/coursepage/slider/poster', coursesController.get_coursepage_slider_poster);
router.get('/coursepage/course/favourite', coursesController.get_view_favourite_course);
router.put('/materials/ratings/:ratingId', protect, coursesController.put_update_material_rating);// asasd
router.post('/:courseId', coursesController.post_create_course_material);// sudah
router.get('/:courseSlug', checkID, coursesController.get_view_one_course);// sudah
router.post('/:materialSlug/comment', protect, coursesController.post_create_new_comment);// sudah
router.put('/:materialSlug/tag-video', protect, coursesController.put_tag_material_video);// sudah
router.get('/:courseSlug/purchase/confirmation', protect, coursesController.get_course_purchase_confirmation); // sudah
router.post('/:courseSlug/purchase/checkout', protect, coursesController.post_checkout_new_course); // sudah
router.get('/:materialSlug/comments/:commentId/replies/new', protect, coursesController.get_new_replies); // sudah
router.post('/:materialSlug/comments/:commentId/replies', protect, coursesController.post_create_new_replies);// sudah
router.get('/:courseSlug/:materialSlug', checkID, coursesController.get_view_one_course_material);
router.post('/:courseSlug/:materialSlug', protect, coursesController.post_create_material_rating);// sudah

module.exports = router;
