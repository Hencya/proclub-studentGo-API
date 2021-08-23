const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    res.status(401).json({
      error: true,
      msg: 'You have no token',
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select(
      'avatar cloudinary_id _id name email password status_pendidikan no_telepon',
    );
    if (!user) {
      res.status(404).json({
        error: true,
        msg: 'No user found with this id',
      });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
};

exports.checkID = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    req.user = 'undifined';
    next();
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select(
        'avatar cloudinary_id _id name email password status_pendidikan no_telepon',
      );
      if (!user) {
        req.user = 'undifined';
      } else {
        req.user = user;
      }
      next();
    } catch (error) {
      console.log(error);
    }
  }
};
