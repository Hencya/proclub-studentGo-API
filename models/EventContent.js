const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const domPurifier = require('dompurify');
const { JSDOM } = require('jsdom');

const htmlPurify = domPurifier(new JSDOM().window);

const { ObjectId } = mongoose.Schema;

mongoose.plugin(slug);

const eventSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  broadcast_media: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date_start_event: {
    type: Date,
    required: true,
  },
  date_end_event: {
    type: Date,
    required: true,
  },
  start_event: {
    type: String,
    required: true,
  },
  end_event: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  organizer_name: {
    type: String,
    required: true,
  },
  organizer_email: {
    type: String,
    required: true,
  },
  no_hp: {
    type: String,
    required: true,
  },
  imagesUrl: {
    type: [String],
    required: true,
  },
  slug: {
    type: String,
    slug: 'title',
    unique: true,
    slug_padding_size: 2,
  },
  cloudinary_id: {
    type: [String],
    unique: true,
    required: true,
  },
}, {
  timestamps: true,
});

eventSchema.pre('validate', (next) => {
  if (this.requirement) {
    this.requirement = htmlPurify.sanitize(this.requirement);
  }

  if (this.description) {
    this.description = htmlPurify.sanitize(this.description);
  }

  next();
});

module.exports = mongoose.model('event', eventSchema);
