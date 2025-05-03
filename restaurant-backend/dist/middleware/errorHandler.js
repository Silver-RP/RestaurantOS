'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const ErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';
  res.status(statusCode).json({
    success: false,
    message,
  });
};
exports.default = ErrorHandler;
