const HttpError = require("../models/http-errors");

const bcryptjs = require("bcryptjs");

const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const getUser = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Could not fetch users, please try again later",
      500
    );
    return next(error);
  }

  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existedUser;

  try {
    existedUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Could not signing in, please try again later",
      500
    );
    return next(error);
  }

  if (!existedUser) {
    const error = new HttpError(
      "email or password are incorrect,please try again",
      401
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcryptjs.compare(password, existedUser.password);
  } catch (err) {
    const error = new HttpError(
      "email or password are incorrect,please try again",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "invalid credentials, could not log you in",
      401
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existedUser.id, email: existedUser.email },
      "superscret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Loggin failed, please try again later", 500);
    return next(error);
  }

  res.json({ userId: existedUser.id, email: existedUser.email, token: token });
};

const signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(error);
    return next(new HttpError("invalid inputs passes, check your data", 422));
  }
  const { name, email, password } = req.body;

  let userExisted;
  try {
    userExisted = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Could not sign up, please try later", 500);
    return next(error);
  }

  if (userExisted) {
    const error = new HttpError(
      "This email is already taken, please choose another one",
      500
    );
    return next(error);
  }

  let hashPassword;
  try {
    hashPassword = await bcryptjs.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again later",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password: hashPassword,
    image: "http://localhost:5000/" + req.file.path,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Sign-up failed, please try again later", 500);
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      "superscret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Sign-up failed, please try again later", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

exports.getUser = getUser;
exports.login = login;
exports.signup = signup;
