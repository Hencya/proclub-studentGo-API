const ArchiveEvent = require('../models/ArchiveEvent');

module.exports = {
  createEventArchive: async (req, res) => {
    const eventId = req.body.trigger_id;

    //! nanti diambil dari req.user => jwt => ganti req.body menjadi req.user dan hapus req.body userId di POSTMAN
    const { userId } = req.body;

    try {
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
    const archiveId = req.params.trigger_id;
    //! nanti di ambil dari req.user => hapus req.params di ROUTES dan hapus juga params nya di postman
    const { userId } = req.params;
    const deletedArchive = await ArchiveEvent.findOneAndDelete({
      _id: archiveId,
      user: userId,
    });

    if (!deletedArchive) {
      return res.status(404).json({ status: 404, message: 'Archive tidak ditemukan', result: false });
    }
    res.status(200).json({ status: 200, message: 'Success Delete Archive', result: true });
  },

  getAllArchive: async (req, res) => {
    //! nanti diganti dengan req.user => jwt => dan hapus userId di req.body
    const { userId } = req.body;
    try {
      const archives = await ArchiveEvent.find({ user: userId }).select('-__v').populate('event', '-__v');
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
