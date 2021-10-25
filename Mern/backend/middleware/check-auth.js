const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-errors");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new HttpError("Could not authentication");
    }
    const decodedToken = jwt.verify(token, "superscret_dont_share");
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Could not authentication", 401);
    return next(error);
  }
};
