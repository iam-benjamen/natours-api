const User = require("../models/userModels");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

const signToken = id =>{
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser.id);
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //check if email and password exists
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  //check if user exists && password is correct
  const user = await User.findOne({email}).select("+password");

  if(!user || !await user.correctPassword(password, user.password)) {
    return next(new AppError("Invalid email or password", 401));
  }

  //if everything is okay, send token
  const token = signToken(user._id);

  res.status(200).json({
    status: "sucess",
    token,
  });
});

exports.protect = catchAsync(async(req, res, next) => {
  // Get token and check if it's there
  
  // Verification of token
  // Check if user still exists
  // Check if user changed password after token was issued
  
  next();
})
