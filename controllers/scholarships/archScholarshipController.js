const ArchiveScholarship = require('../../models/scholarships/ArchiveScholarship');

module.exports.post_scholarship_archive = async (req, res) => {
  const scholarId = req.body.trigger_id;

  const userId = req.user._id;
  try {
    const newScholarArchive = new ArchiveScholarship({
      user: userId,
      scholarship: scholarId,
    });
    const savedScholarArchive = await newScholarArchive.save();
    res
      .status(201)
      .json({
        status: 201,
        message: 'Success Post Scholarship Archive',
        result: savedScholarArchive,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

module.exports.delete_scholarship_archive = async (req, res) => {
  const archiveId = req.params.trigger_id;

  const userId = req.user._id;
  const deletedArchive = await ArchiveScholarship.findOneAndDelete({
    _id: archiveId,
    user: userId,
  });

  if (!deletedArchive) {
    return res.status(404).json({ status: 200, message: 'Archive tidak ditemukan', result: false });
  }
  res
    .status(200)
    .json({ status: 200, message: 'Success Delete Archive', result: true });
};

module.exports.get_view_all_archive = async (req, res) => {
  const userId = req.user._id;
  try {
    const archives = await ArchiveScholarship.find({ user: userId }).select('-__v').populate('scholarship', '-__v');
    res.status(200).json({ status: 200, message: 'Success Get All Archive', result: archives });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};
