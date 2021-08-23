const router = require('express').Router();
const archEventContentController = require('../controllers/archEventController');
const { protect } = require('../middleware/auth');

//! archive => masih optional => nanti akan disesuaikan dengan farah
router.post('/', protect, archEventContentController.createEventArchive);

//! archieve => masih optional => nanti akan disesuaikan dengan farah
router.get('/', protect, archEventContentController.getAllArchive);

//! nanti hapus userId jika login sudah selesai => cek di belajar restfull api resource naming => cocokan dengan yang delete => masih ragu
router.delete('/:trigger_id ', protect, archEventContentController.deleteEventArchive);

module.exports = router;
