const mongoose = require('mongoose');

const archScholarshipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  scholarship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scholarship',
  },
});

module.exports = mongoose.model('ArchiveScholarship', archScholarshipSchema);
