const Scholarship = require('../../models/scholarships/Scholarship');
const cloudinary = require('../../utils/cloudinary');
const ArchiveScholarship = require('../../models/scholarships/ArchiveScholarship');

module.exports.post_create_scholarship = async (req, res) => {
  try {
    if (!req.file) {
      const err = new Error('Image must be uploaded');
      err.errorStatus = 422;
      throw err;
    }

    const user = req.user._id;

    const poster = await cloudinary.uploader.upload(req.file.path, {
      upload_preset: 'student-go-scholarship-poster',
    });
    const {
      title,
      deadline,
      requirement,
      description,
      contact_whatsapp,
      contact_facebook,
      registration_link,
      educational_level,
    } = req.body;
    const newScholarship = new Scholarship({
      user,
      title,
      deadline,
      requirement,
      registration_link,
      poster: poster.secure_url,
      description,
      contact_whatsapp,
      contact_facebook,
      educational_level,
      cloudinary_id: poster.public_id,
    });
    req.cloud_id = poster.public_id;
    const savedScholarship = await newScholarship.save();
    res.status(201).json({
      status: 201,
      message: 'Success Create New Scholarship',
      result: savedScholarship,
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      await cloudinary.uploader.destroy(req.cloud_id);
      return res.status(409).json({ message: 'Registration link already exists (must be unique)' });
    }
    await cloudinary.uploader.destroy(req.cloud_id);
    res.status(500).json({ message: err });
  }
};

module.exports.get_view_5_latest_scholarship = async (req, res) => {
  try {
    const scholarships = await Scholarship.find().select(
      'title poster deadline description slug _id is_over educational_level',
    ).limit(5).sort({ _id: -1 });
    res.status(200).json({
      status: 200,
      message: 'Success Get 5 Latest Scholarships',
      result: scholarships,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

module.exports.get_view_all_scholarship = async (req, res) => {
  try {
    const scholarships = await Scholarship.find().select(
      'title poster deadline description slug _id is_over educational_level',
    ).skip(5).sort({ _id: -1 });
    res.status(200).json({
      status: 200,
      message: 'Success Get All Scholarships',
      result: scholarships,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

module.exports.get_view_slider_scholarship = async (req, res) => {
  try {
    const scholarships = await Scholarship.find().select(
      'title poster deadline description slug _id is_over educational_level',
    ).limit(10).sort({ _id: -1 });
    res.status(200).json({
      status: 200,
      message: 'Success Get Scholarships Slider',
      result: scholarships,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

module.exports.get_view_one_scholarship_by_slug = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user._id;
    const scholarship = await Scholarship.findOne({ slug }).select(
      '_id slug poster deadline requirement description contact_whatsapp contact_facebook is_over registration_link educational_level',
    ).lean(); // .lean() berfungsi agar document scholarship bisa ditambahkan key value baru (menambahkan element baru) dan mempercepat kinerja find
    if (userId) { // jika ditemukan user
      const archieve_scholarship = await ArchiveScholarship.findOne({ user: userId, scholarship: scholarship._id });
      if (archieve_scholarship) { // jika user sudah menyimpan arsip
        scholarship.is_saved = true;
        scholarship.is_login = true;
        scholarship.trigger_id = archieve_scholarship._id;
      } else { // jika user belum menyimpan arsip
        scholarship.is_saved = false;
        scholarship.is_login = true;
        scholarship.trigger_id = scholarship._id;
      }
    } else { // jika tidak ditemukan user
      scholarship.is_saved = false;
      scholarship.is_login = false;
      scholarship.trigger_id = false;
    }
    res.status(200).json({ status: 200, message: 'Success Get One Scholarship', result: scholarship });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};
//! AKHIR GET MODULE

//! SEARCH SCHOLARSHIP
module.exports.get_view_search_scholarship = async (req, res) => {
  try {
    const { title } = req.query;
    const { sort } = req.query;
    const { edulevel } = req.query;
    let scholarships = [];
    if (!title) {
      return res.status(404).json({
        status: 404,
        message: 'Scholarship Not Found',
        result: scholarships,
      });
    }
    if (sort) {
      if (edulevel) {
        const edulevelarr = edulevel.split(',');
        scholarships = await Scholarship.find({ title: new RegExp(title, 'i'), educational_level: { $in: edulevelarr } }).select(
          'title poster deadline description slug _id is_over educational_level',
        ).sort({ deadline: `${sort}` });
      } else {
        scholarships = await Scholarship.find({ title: new RegExp(title, 'i') }).select(
          'title poster deadline description slug _id is_over educational_level',
        ).sort({ deadline: `${sort}` });
      }
    } else if (edulevel) {
      const edulevelarr = edulevel.split(',');
      scholarships = await Scholarship.find({ title: new RegExp(title, 'i'), educational_level: { $in: edulevelarr } }).select(
        'title poster deadline description slug _id is_over educational_level',
      );
    } else {
      scholarships = await Scholarship.find({ title: new RegExp(title, 'i') }).select(
        'title poster deadline description slug _id is_over educational_level',
      );
    }
    if (scholarships.length > 0) {
      return res.status(200).json({
        status: 200,
        message: 'Success Get Search Scholarships',
        result: scholarships,
      });
    }
    return res.status(404).json({
      status: 404,
      message: 'Scholarship Not Found',
      result: scholarships,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};
