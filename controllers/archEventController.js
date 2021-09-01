const ArchiveEvent = require('../models/ArchiveEvent');

module.exports = {
  createEventArchive: async (req, res) => {
    try {
      // ini triger-id nya pakek uang _id event
      const eventId = req.body.trigger_id;

      const userId = req.user._id;

      if (userId === undefined) {
        const error = new Error('User Doesnt Exist');
        error.errorStatus = 404;
        throw error;
      }

      if (eventId === undefined) {
        const error = new Error('Event Doesnt Exist');
        error.errorStatus = 404;
        throw error;
      }

      const newArchiveEvent = new ArchiveEvent({
        user: userId,
        event: eventId,
      });

      const savedArchiveEvent = await newArchiveEvent.save();
      res.status(201).json({
        status: 201,
        message: 'Success Post Event Archive',
        result: savedArchiveEvent,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  },

  deleteEventArchive: async (req, res) => {
    try {
      // ini triger-id nya pakek yang _id archives
      const archiveId = req.params.trigger_id;
      const userId = req.user._id;

      if (userId === undefined) {
        const error = new Error('User Doesnt Have Archive Event');
        error.errorStatus = 404;
        throw error;
      }

      if (archiveId === undefined) {
        const error = new Error('Archive Event Doesnt Exist');
        error.errorStatus = 404;
        throw error;
      }

      const deletedArchive = await ArchiveEvent.findOneAndDelete({
        _id: archiveId,
        user: userId,
      });

      if (!deletedArchive) {
        return res.status(404).json({ status: 404, message: 'Archive tidak ditemukan', result: false });
      }
      res.status(200).json({ status: 200, message: 'Success Delete Archive', result: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  },

  getAllArchive: async (req, res) => {
    const userId = req.user._id;
    try {
      const archives = await ArchiveEvent.find({ user: userId }).select('-__v').populate('EventContent', '-__v');
      if (archives.length < 1) {
        res.status(404).json({ status: 404, message: 'Fail Get All Archive', result: archives });
      }
      res.status(200).json({ status: 200, message: 'Success Get All Archive', result: archives });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  },

};
