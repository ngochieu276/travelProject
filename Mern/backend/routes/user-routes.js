const express = require("express");
const { check } = require("express-validator");

const userController = require("../controllers/users-control");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/", userController.getUser);

router.post("/login", userController.login);

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  userController.signup
);

module.exports = router;
