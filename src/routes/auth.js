const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/token");

const { body, validationResult } = require("express-validator");

const db = require("../connection/database");

let userValidation = [
  body("email").isEmail(),
  body("name").notEmpty(),
  body("password").notEmpty(),
];

router.post("/login", async function (req, res) {
  try {
    const user = db
      .prepare(`SELECT * FROM users WHERE email = (?)`)
      .get(req.body.email);

    if (!user) {
      return res.json({
        status: 401,
        message: "Invalid Credentials",
      });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      return res.json({
        status: 401,
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      {
        email: user.email,
      },
      "secret",
      {
        expiresIn: "1h",
      }
    );

    res.json({
      status: 200,
      token: token,
    });
  } catch (e) {
    console.error(`Error: ${e}`);
  }
});

router.post("/logout", function (req, res) {
  try {
    const token = localStorage.getItem("token");

    localStorage.removeItem("token");
  } catch (e) {
    return res.json({
      status: 400,
      message: "Logout gagal",
    });
  }

  return res.json({
    status: 200,
    message: "Logged Out Successfully",
  });
});

module.exports = router;
