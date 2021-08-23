const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const ownerEventSchema = new mongoose.Schema({
  event: {
    type: ObjectId,
    ref: 'EventContent',
  },
  user: {
    type: ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('EventOwner', ownerEventSchema);
