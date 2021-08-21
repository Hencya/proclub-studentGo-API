const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const ArchiveEventSchema = mongoose.Schema({
  user: {
    type: ObjectId,
    ref: 'User',
  },
  event: {
    type: ObjectId,
    ref: 'EventContent',
  },
});

module.exports = mongoose.model('ArchiveEvent', ArchiveEventSchema);
