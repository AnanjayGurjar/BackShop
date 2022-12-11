const User = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");

exports.signup = BigPromise(async (req, res, next) => {
  if (req.files) {
    return next(new CustomError("photo is required for signup", 400));
  }
  const { name, email, password } = req.body;

  if (!email || !name || !password) {
    return next(
      new CustomError("Name , Email and password are mandatory", 400)
    );
  }
  let file = req.files.photo;
  const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
    folder: "users",
    width: 150,
    crop: "scale",
  });

  const user = await User.create({
    name,
    email,
    password,
    photo: {
      id: result.public_id,
      secure_url: result.secure_url,
    },
  });

  cookieToken(user, res);
});

exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new CustomError("please provide email and password"));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(
      new CustomError("You are not registered, please signup first", 400)
    );
  }

  const isPasswordCorrect = await user.isEnteredPasswordCorrect(password);

  if (!isPasswordCorrect) {
    return next(new CustomError("Wrong password"));
  }
  cookieToken(user, res);
});
