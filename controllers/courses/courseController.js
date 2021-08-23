const Course = require('../../models/courses/Course');
const Material = require('../../models/courses/Material');
const cloudinary = require('../../utils/cloudinary');
const Comment = require('../../models/courses/Comment');
const Reply = require('../../models/courses/Reply');
const Rating = require('../../models/courses/Rating');
const CourseOwner = require('../../models/courses/Owner');

module.exports.post_create_course = async (req, res) => {
  try {
    if (!req.file) {
      const err = new Error('Image must be uploaded');
      err.errorStatus = 422;
      throw err;
    }
    const poster = await cloudinary.uploader.upload(req.file.path, {
      upload_preset: 'student-go-course-poster',
    });
    const {
      title, description, category, ownerships, author, price,
    } = req.body;
    const newCourse = new Course({
      title,
      description,
      category,
      ownerships,
      author,
      price,
      poster: poster.secure_url,
      cloudinary_id: poster.public_id,
    });
    req.cloud_id = poster.public_id;
    const savedCourse = await newCourse.save();
    res.status(201).json({
      status: 201,
      message: 'Success Create New Course',
      result: savedCourse,
    });
  } catch (err) {
    console.error(err);
    await cloudinary.uploader.destroy(req.cloud_id);
    res.status(500).json({ message: err });
  }
};

//! GET MODULE
module.exports.get_view_all_course = async (req, res) => {
  try {
    const result = await Course.aggregate([
      {
        $lookup: {
          from: 'ratings',
          localField: '_id',
          foreignField: 'course',
          as: 'arr_ratings',
        },
      },
      {
        $unwind: {
          path: '$arr_ratings',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          title: { $first: '$title' },
          description: { $first: '$description' },
          category: { $first: '$category' },
          poster: { $first: '$poster' },
          slug: { $first: '$slug' },
          course_rating: { $avg: { $ifNull: ['$arr_ratings.rating', 0] } },
        },
      },
      // descending
      { $sort: { course_rating: -1 } },
      { $skip: 6 },
    ]);
    for (let i = 0; i < result.length; i++) {
      const material = await Material.find({ course: result[i]._id });
      result[i].material_video = material.length;
    }
    res.status(200).json({
      status: 200,
      message: 'Success Get All Courses',
      result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

module.exports.get_homepage_slider_poster = async (req, res) => {
  try {
    const coursePoster = await Course.find().select('_id poster slug').sort({ _id: -1 }).limit(3);
    res.status(200).json({
      status: 200,
      message: 'Success Get Homepage Slider Poster',
      result: coursePoster,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

module.exports.get_coursepage_slider_poster = async (req, res) => {
  try {
    const coursePoster = await Course.find().select('_id poster slug').sort({ _id: -1 }).limit(3);
    res.status(200).json({
      status: 200,
      message: 'Success Get Homepage Slider Poster',
      result: coursePoster,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

module.exports.get_view_favourite_course = async (req, res) => {
  try {
    const result = await Course.aggregate([
      {
        $lookup: {
          from: 'ratings',
          localField: '_id',
          foreignField: 'course',
          as: 'arr_ratings',
        },
      },
      {
        $unwind: {
          path: '$arr_ratings',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          title: { $first: '$title' },
          description: { $first: '$description' },
          category: { $first: '$category' },
          poster: { $first: '$poster' },
          slug: { $first: '$slug' },
          course_rating: { $avg: { $ifNull: ['$arr_ratings.rating', 0] } },
        },
      },
      // descending
      { $sort: { course_rating: -1 } },
      { $limit: 6 },
    ]);
    for (let i = 0; i < result.length; i++) {
      const material = await Material.find({ course: result[i]._id });
      result[i].material_video = material.length;
    }
    res.status(200).json({
      status: 200,
      message: 'Success Get All Courses',
      result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

//! AKHIR GET MODULE

module.exports.post_create_course_material = async (req, res) => {
  const { courseId } = req.params;
  try {
    const {
      material_title, material_video, pdf_material, category_material,
    } = req.body;
    const newMaterial = new Material({
      course: courseId,
      material_title,
      material_video,
      pdf_material,
      category_material,
    });
    const savedMaterial = await newMaterial.save();
    res.status(201).json({
      status: 201,
      message: 'Success Create New Material',
      result: savedMaterial,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

module.exports.get_view_one_course = async (req, res) => {
  const { courseSlug } = req.params;
  const user = req.user_id;
  try {
    const course = await Course.findOne({ slug: courseSlug }).select('_id title description category poster slug').lean();
    const course_owner = await CourseOwner.findOne({ user, course: course._id });
    if (course_owner) {
      course.purchased = true;
    } else {
      course.purchased = false;
    }
    const materials = await Material.find({ course: course._id }).select('_id course slug material_title category_material');
    res.status(200).json({ status: 200, message: 'Success Get One Course', result: { course, materials } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

module.exports.get_view_one_course_material = async (req, res) => {
  const { courseSlug, materialSlug } = req.params;
  try {
    const user = req.user._id;
    const course = await Course.findOne({ slug: courseSlug }).select('_id');
    const material = await Material.findOne({ course: course._id, slug: materialSlug }).select('-__v -tagged_by').lean().populate('course', '_id title slug')
      .populate({ path: 'comments', populate: { path: 'replies', select: '-__v' }, select: '_id user content date replies' });
    const cekTag = await Material.findOne({ course: course._id, slug: materialSlug }).select('tagged_by');
    if (!cekTag.tagged_by.includes(user)) {
      material.is_tagged = false;
    } else {
      material.is_tagged = true;
    }
    const rating = await Rating.findOne({ material: material._id, user }).select('_id rating');
    material.rating = rating;
    res.status(200).json({ status: 200, message: 'Success Get One Course Material', result: material });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

module.exports.post_create_new_comment = async (req, res) => {
  const { materialSlug } = req.params;
  try {
    const material = await Material.findOne({ slug: materialSlug });
    const user = req.user._id;
    const { content } = req.body;
    const newComment = new Comment({
      user,
      content,
    });
    const savedComment = await newComment.save();
    material.comments.unshift(savedComment);
    await material.save();
    res.status(201).json({
      status: 201,
      message: 'Success Create New Comment',
      result: savedComment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

module.exports.get_new_replies = async (req, res) => {
  const { materialSlug, commentId } = req.params;
  try {
    const material = await Material.findOne({ slug: materialSlug }).select('-__v');
    const currentUser = req.user.id;
    const comment = await Comment.findById(commentId).select('-__v');
    res.status(200).json({
      status: 200,
      message: 'Success Create New Comment',
      result: {
        material,
        currentUser,
        comment,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

module.exports.post_create_new_replies = async (req, res) => {
  try {
    const user = req.user._id;
    const { content } = req.body;
    const { materialSlug, commentId } = req.params;
    const reply = new Reply({
      user,
      content,
    });
    const material = await Material.findOne({ slug: materialSlug });
    await reply.save();
    const comment = await Comment.findById(commentId);
    comment.replies.unshift(reply._id);
    await comment.save();
    await material.save();
    res.status(200).json({
      status: 201,
      message: 'Success Create New Replies',
      result: reply,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

module.exports.put_tag_material_video = async (req, res) => {
  try {
    const { materialSlug } = req.params;
    const user = req.user._id;
    const material = await Material.findOne({ slug: materialSlug });
    if (!material.tagged_by.includes(user)) {
      await material.updateOne({ $push: { tagged_by: user } });
      res.status(200).json('Successfully marked the video as viewed');
    } else {
      await material.updateOne({ $pull: { tagged_by: user } });
      res.status(200).json('Successfully unmarked the video as viewed');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

module.exports.post_create_material_rating = async (req, res) => {
  try {
    const { courseSlug, materialSlug } = req.params;
    const { rating } = req.body;
    const user = req.user._id;
    const course = await Course.findOne({ slug: courseSlug }).select('_id ratings');
    const material = await Material.findOne({ slug: materialSlug }).select('_id');
    const newRating = new Rating({
      user,
      rating,
      course: course._id,
      material: material._id,
    });
    const savedRating = await newRating.save();
    course.ratings.push(savedRating._id);
    course.save();
    res.status(201).json({
      status: 201,
      message: 'Success Create New Rating',
      result: savedRating,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

module.exports.put_update_material_rating = async (req, res) => {
  try {
    const userId = req.user._id;
    const { rating } = req.body;
    const { ratingId } = req.params;
    const newRating = await Rating.findById(ratingId).select('rating user');
    if (newRating.user.equals(userId)) {
      await newRating.updateOne({ $set: { rating } });
      res.status(200).json({
        status: 200,
        message: 'Rating has been updated',
        result: true,
      });
    } else {
      res.status(403).json({
        status: 403,
        message: 'You can update only your rating',
        result: false,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

module.exports.get_course_purchase_confirmation = async (req, res) => {
  try {
    const { courseSlug } = req.params;
    const course = await Course.findOne({ slug: courseSlug }).select('_id title ownerships author price slug poster');
    res.status(200).json({
      status: 200,
      message: 'Confirmation Pages',
      result: course,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

module.exports.post_checkout_new_course = async (req, res) => {
  try {
    const { courseSlug } = req.params;
    const user = req.user._id;
    const course = await Course.findOne({ slug: courseSlug }).select('_id');
    const newOwner = new CourseOwner({
      user,
      course: course._id,
    });
    const savedOwner = await newOwner.save();
    res.status(201).json({
      status: 201,
      message: 'Success Purchase The Course',
      result: savedOwner,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

module.exports.get_view_search_course = async (req, res) => {
  try {
    const { title } = req.query;
    const result = await Course.aggregate([
      {
        $lookup: {
          from: 'ratings',
          localField: '_id',
          foreignField: 'course',
          as: 'arr_ratings',
        },
      },
      {
        $unwind: {
          path: '$arr_ratings',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          title: { $first: '$title' },
          description: { $first: '$description' },
          category: { $first: '$category' },
          poster: { $first: '$poster' },
          slug: { $first: '$slug' },
          course_rating: { $avg: { $ifNull: ['$arr_ratings.rating', 0] } },
        },
      },
      { $match: { title: new RegExp(title, 'i') } },
    ]);
    for (let i = 0; i < result.length; i++) {
      const material = await Material.find({ course: result[i]._id });
      result[i].material_video = material.length;
    }
    res.status(200).json({
      status: 200,
      message: 'Success Get Search Courses',
      result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};
