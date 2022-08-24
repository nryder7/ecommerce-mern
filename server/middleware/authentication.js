const { UnauthenticatedError, ForbiddenError } = require('../errors');
const { isTokenValid } = require('../utils');

const authenticateUser = async (req, res, next) => {
  const { token } = req.signedCookies;

  if (!token) {
    throw new UnauthenticatedError('Invalid authentication');
  }
  try {
    const payload = isTokenValid({ token });
    const { name, role, userId } = payload;
    req.user = { name, role, userId };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Invalid authentication');
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError('Access forbidden');
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
