const jwt = require('jsonwebtoken');

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  return token;
};

const isTokenValid = ({ token }) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const attachCookiesToResp = ({ res, user }) => {
  //expires in 1 day, matches jwt expiration in .env

  const expiresIn = 1000 * 60 * 60 * 24;
  const token = createJWT({ payload: user });

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + expiresIn),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
};

module.exports = { createJWT, isTokenValid, attachCookiesToResp };
