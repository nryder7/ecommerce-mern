const { createJWT, isTokenValid, attachCookiesToResp } = require('./jwt');
const checkPermissions = require('./checkPermissions');
const createTokenUser = require('./createTokenUser');

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResp,
  createTokenUser,
  checkPermissions,
};
