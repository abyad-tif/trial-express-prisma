const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");

const { verify } = require("crypto");
const verifyToken = require("../middleware/token");
const prisma = require("../utils/db");

// Fungsi Menampilkan Data - BetterSqlite3
router.get("/", verifyToken, async function (req, res) {
  try {
    // const query = db.prepare(`SELECT * FROM alumni`).all();
    const user = await prisma.alumni.findUnique({
      where: { user_id: req.user.id },
    });

    return res.json({
      status: 200,
      message: "Data Profil",
      data: user,
    });
  } catch (e) {
    console.error(`Error fetching data: ${e}`);
  }
});

let alumniValidation = [
  body("name").notEmpty(),
  body("nim").notEmpty(),
  body("email").isEmail(),
  body("gender").notEmpty(),
  body("no_wa").notEmpty(),
  body("tmpt_tinggal").notEmpty(),
];

// Fungsi Memasukkan Data - Non User Login
router.post("/store", alumniValidation, async function (req, res) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      errors: error.array(),
    });
  }

  try {
    await prisma.alumni.create({
      data: {
        name: req.body.name,
        nim: req.body.nim,
        email: req.body.email,
        gender: req.body.gender,
        no_wa: req.body.no_wa,
        tmpt_tinggal: req.body.tmpt_tinggal,
      },
    });

    return res.json({
      status: 201,
      message: "Data Berhasil Ditambahkan",
    });
  } catch (e) {
    console.error(`Error: ${e}`);
  }
});

// Fungsi Memasukkan Data - User login
router.patch(
  "/update",
  alumniValidation,
  verifyToken,
  async function (req, res) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        errors: error.array(),
      });
    }

    try {
      await prisma.alumni.update({
        where: { user_id: req.user.id },
        data: {
          name: req.body.name,
          nim: req.body.nim,
          email: req.body.email,
          gender: req.body.gender,
          no_wa: req.body.no_wa,
          tmpt_tinggal: req.body.tmpt_tinggal,
        },
      });

      return res.json({
        status: 201,
        message: "Data berhasil diubah",
      });
    } catch (e) {
      console.error(`Error inserting data: ${e}`);
    }
  }
);

module.exports = router;
