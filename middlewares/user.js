const User = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = BigPromise(async (req, res, next) => {
  // NOTE:  if token is not passed through both header and cookie the code will never reach the error asking to login first as it will give error here itself as it is trying to find header and replacing its "Bearer " which is undefined
  const token =
    req.cookies.token || req.header("Authorization").replace("Bearer", "");

  if (!token) {
    return next(new CustomError("Please login first to access this page", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded.id);

  next();
});
