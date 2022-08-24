const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResp, createTokenUser } = require('../utils/');

const register = async (req, res) => {
  const { email, name, password, role } = req.body;
  const findEmail = await User.findOne({ email });
  if (findEmail) {
    throw new CustomError.BadRequestError('Email already exists');
  }
  //register first user as admin, no longer destructure in req.body
  // const isFirstAccount = (await User.countDocuments({})) === 0;
  // const role = isFirstAccount ? 'admin' : 'user';

  const user = await User.create({ email, name, password, role });
  const tokenUser = createTokenUser(user);

  attachCookiesToResp({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError(
      'Must enter valid email and password'
    );
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid credentials');
  }
  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    throw new CustomError.UnauthenticatedError('Invalid credentials');
  }
  const tokenUser = createTokenUser(user);
  attachCookiesToResp({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK);
  //development only response
  res.json({ msg: 'logged out' });
};

module.exports = { register, login, logout };
