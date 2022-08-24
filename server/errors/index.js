const CustomAPIError = require('./custom-api');
const UnauthenticatedError = require('./unauthenticated');
const ForbiddenError = require('./forbidden');
const NotFoundError = require('./not-found');
const BadRequestError = require('./bad-request');
module.exports = {
  CustomAPIError,
  UnauthenticatedError,
  ForbiddenError,
  NotFoundError,
  BadRequestError,
};
