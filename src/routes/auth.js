const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/token");

const { body, validationResult } = require("express-validator");

const prisma = require("../utils/db");

let userValidation = [
  body("email").isEmail(),
  body("name").notEmpty(),
  body("password").notEmpty(),
];

// Fungsi Register Data = BetterSqlite3
router.post("/register", userValidation, async function (req, res) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      errors: error.array(),
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const date = new Date();

    await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        password: hashedPassword,
        alumni: {
          email: req.body.email,
          name: req.body.name,
        },
      },
    });

    return res.json({
      status: 201,
      message: "Data berhasil ditambahkan",
    });
  } catch (e) {
    console.error(`Error inserting data: ${e}`);
  }
});

router.post("/login", async function (req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

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
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "30m",
      }
    );

    res.json({
      status: 200,
      access_token: token,
      token_type: "bearer",
      expired_in: 1800,
    });
  } catch (e) {
    console.error(`Error: ${e}`);
  }
});

router.post("/logout", verifyToken, function (req, res) {
  try {
    res.cookie("access_token", req.user.token, {
      httpOnly: true,
      maxAge: 0,
    });

    return res.json({
      status: 200,
      message: "Logout berhasil",
    });
  } catch (e) {
    return res.json({
      status: 400,
      message: "Logout gagal",
      err: `${e}`,
    });
  }
});

module.exports = router;
