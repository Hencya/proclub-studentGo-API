const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const ratingSchema = new mongoose.Schema({
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  rating: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Rating', ratingSchema);
