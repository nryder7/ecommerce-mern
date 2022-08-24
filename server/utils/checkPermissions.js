const { ForbiddenError } = require('../errors');

const checkPermissions = (reqUser, userId) => {
  if (reqUser.role === 'admin') return;
  if (reqUser.userId === userId.toString()) return;
  throw new ForbiddenError('Invalid permission');
};

module.exports = checkPermissions;
