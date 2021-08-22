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
  deadline: {
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
  name_bank: {
    type: String,
    required: true,
  },
  user_bank: {
    type: String,
    required: true,
  },
  no_rekening: {
    type: String,
    required: true,
  },
  no_hp: {
    type: String,
    required: true,
  },
  organizer_name: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  image_1: {
    type: String,
    required: true,
  },
  image_2: {
    type: String,
    required: true,
  },
  image_3: {
    type: String,
    required: true,
  },
  image_4: {
    type: String,
    required: true,
  },
  cld_poster_id: {
    type: String,
    required: true,
    sparse: true,
  },
  cld_logo_id: {
    type: String,
    required: true,
    sparse: true,
  },
  cld_image_1_id: {
    type: String,
    required: true,
    sparse: true,
  },
  cld_image_2_id: {
    type: String,
    required: true,
    sparse: true,
  },
  cld_image_3_id: {
    type: String,
    required: true,
    sparse: true,
  },
  cld_image_4_id: {
    type: String,
    required: true,
    sparse: true,
  },
  registration_link: {
    type: String,
    required: true,
    unique: true,
  },
  numberOfTicket: {
    type: Number,
    required: true,
  },
  slug: {
    type: String,
    slug: 'title',
    sparse: true,
    slug_padding_size: 2,
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
