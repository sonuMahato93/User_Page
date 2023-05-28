const catchAsyncError = (passFunction) => (req, res, next) => {
  Promise.resolve(passFunction(req, res, next)).catch(next);
};

module.exports = catchAsyncError;
