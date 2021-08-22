const User = require('../models/User');

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const newUser = await User.create({ email, password });
    res.status(201).json({ status: 201, message: 'Success Create New Account', result: newUser });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports.get_view_all_users = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ status: 200, message: 'Success Get All Users Account', result: users });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
