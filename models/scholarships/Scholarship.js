const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const domPurifier = require('dompurify');
const { JSDOM } = require('jsdom');

const htmlPurify = domPurifier(new JSDOM().window);

mongoose.plugin(slug);

const scholarshipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  requirement: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    required: true,
  },
  contact_whatsapp: {
    type: String,
  },
  contact_facebook: {
    type: String,
  },
  cloudinary_id: {
    type: String,
    unique: true,
    required: true,
  },
  registration_link: {
    type: String,
    required: true,
    unique: true,
  },
  educational_level: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    slug: 'title',
    unique: true,
    slug_padding_size: 2,
  },
});

scholarshipSchema.pre('validate', function (next) {
  if (this.requirement) {
    this.requirement = htmlPurify.sanitize(this.requirement);
  }

  if (this.description) {
    this.description = htmlPurify.sanitize(this.description);
  }

  next();
});

module.exports = mongoose.model('Scholarship', scholarshipSchema);
