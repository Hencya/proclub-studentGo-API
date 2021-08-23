const User = require('../models/User');
const cloudinary = require('../utils/cloudinary');

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.cookie('token', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
  res.status(statusCode).json({ status: statusCode, message: 'Login success', data: { token } });
};

exports.register = async (req, res) => {
  const {
    name, email, password, status_pendidikan, no_telepon,
  } = req.body;
  try {
    const user = await User.create({
      name, email, password, status_pendidikan, no_telepon,
    });
    res.status(201).json({ status: 201, message: 'Registration Success', data: user });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ status: 400, success: false, error: 'Please provide email and password' });
  }
  try {
    const user = await User.findOne({ email: req.body.email }).select('+password');
    if (!user) {
      res.status(400).json({
        status: 400,
        success: false,
        error: 'Invalid credentials',
      });
    }
    const isMatch = await user.matchPasswords(password);
    if (!isMatch) {
      res.status(400).json({
        status: 400,
        success: false,
        error: 'Invalid credentials',
      });
    }
    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ status: 500, success: false, error: error.message });
  }
};

exports.profile = async (req, res, next) => {
  const { user } = req;
  try {
    res.status(201).json({ status: 201, message: 'Display Profile Success', data: user });
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
};

exports.update = async (req, res) => {
  const { user } = req;
  try {
    if (user.cloudinary_id != 'avatar/1629700275523_user_rqgafp') {
      await cloudinary.uploader.destroy(user.cloudinary_id);
    }
    var result;

    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path, {
        upload_preset: 'avatar',
      });
    }

    var data;

    if (req.file === undefined) {
      data = {
        name: req.body.name || user.name,
        email: req.body.email || user.email,
        status_pendidikan: req.body.status_pendidikan || user.status_pendidikan,
        no_telepon: req.body.no_telepon || user.no_telepon,
        avatar: user.avatar,
        cloudinary_id: user.cloudinary_id,
      };
    } else {
      data = {
        name: req.body.name || user.name,
        email: req.body.email || user.email,
        status_pendidikan: req.body.status_pendidikan || user.status_pendidikan,
        no_telepon: req.body.no_telepon || user.no_telepon,
        avatar: result.secure_url,
        cloudinary_id: result.public_id,
      };
    }

    const ResultUser = await User.findByIdAndUpdate(user._id, data, { new: true });
    res.status(201).json({ success: true, data: ResultUser });
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, error: error.message });
  }
};

exports.logout = async (req, res) => res
  .clearCookie('token')
  .status(200)
  .json({ message: 'Successfully logged out 😏 🍀' });

exports.getAvatar = async (req, res, next) => {
  const { user } = req;
  try {
    res.status(201).json({ status: 201, message: 'Display Avatar Success', data: { id: user._id, avatar: user.avatar } });
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
};
