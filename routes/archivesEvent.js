const router = require('express').Router();
const archEventContentController = require('../controllers/archEventController');

//! archive => masih optional => nanti akan disesuaikan dengan farah
router.post('/', archEventContentController.createEventArchive);

//! archieve => masih optional => nanti akan disesuaikan dengan farah
router.get('/', archEventContentController.getAllArchive);

//! nanti hapus userId jika login sudah selesai => cek di belajar restfull api resource naming => cocokan dengan yang delete => masih ragu
router.delete('/:trigger_id/:userId', archEventContentController.deleteEventArchive);

module.exports = router;
