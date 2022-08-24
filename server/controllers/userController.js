const { StatusCodes } = require('http-status-codes');
const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
} = require('../errors');
const User = require('../models/User');
const {
  attachCookiesToResp,
  createTokenUser,
  checkPermissions,
} = require('../utils');

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password');
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOne({ _id: userId }).select('-password');
  if (!user) {
    throw new NotFoundError('No users found');
  }
  checkPermissions(req.user, user._id);

  res.status(StatusCodes.OK).json({ user });
};
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  const { userId } = req.user;
  const { email, name } = req.body;
  if (!email || !name) {
    throw new BadRequestError('No information to update');
  }

  // alternate option with findOneAndUpdate
  // const user = await User.findOneAndUpdate(
  //   { _id: userId },
  //   { email, name },
  //   { new: true, runValidators: true }
  // );

  const user = await User.findOne({ _id: userId });

  user.email = email;
  user.name = name;
  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResp({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ msg: 'successful update' });
};
//

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const id = req.user.userId;

  if (!oldPassword || !newPassword) {
    throw new BadRequestError('must provide old password and new password');
  }
  const user = await User.findOne({ _id: id });

  const isMatch = await user.comparePassword(oldPassword);

  if (!isMatch) {
    throw new UnauthenticatedError('Old password is invalid');
  }

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: 'ok' });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
