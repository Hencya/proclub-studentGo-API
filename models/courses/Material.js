const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const materialSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  material_title: {
    type: String,
    required: true,
  },
  material_video: {
    type: String,
    required: true,
  },
  pdf_material: {
    type: String,
    required: true,
  },
  category_material: {
    type: String,
  },
  tagged_by: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  slug: {
    type: String,
    slug: 'material_title',
    unique: true,
    slug_padding_size: 2,
  },
});

module.exports = mongoose.model('Material', materialSchema);
