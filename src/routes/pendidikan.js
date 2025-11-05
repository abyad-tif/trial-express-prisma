const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");

// const { verify } = require("crypto");
const verifyToken = require("../middleware/token");
const prisma = require("../utils/db");

// Fungsi Menampilkan Data - BetterSqlite3
router.get("/", verifyToken, async function (req, res) {
  try {
    const user = await prisma.pendidikan.findMany({
      where: { pendidikan_id: req.user.id },
    });

    return res.json({
      status: 200,
      message: "Data Pendidikan",
      data: user,
    });
  } catch (e) {
    console.error(`Error fetching data: ${e}`);
  }
});

let pendidikanValidation = [
  body("jenjang").notEmpty(),
  body("thn_masuk").notEmpty(),
  body("thn_lulus").notEmpty(),
  body("universitas").notEmpty(),
  body("fakultas").notEmpty(),
  body("prodi").notEmpty(),
];

// Fungsi Memasukkan Data - Non User Login
router.post("/store", pendidikanValidation, async function (req, res) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      errors: error.array(),
    });
  }

  try {
    await prisma.pendidikan.create({
      data: {
        jenjang: req.body.jenjang,
        thn_masuk: req.body.thn_masuk,
        thn_lulus: req.body.thn_lulus,
        universitas: req.body.universitas,
        fakultas: req.body.fakultas,
        prodi: req.body.prodi,
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
router.post(
  "/update",
  pendidikanValidation,
  verifyToken,
  async function (req, res) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        errors: error.array(),
      });
    }

    try {
      await prisma.pendidikan.create({
        // where: { alumni_email: req.user.email },
        data: {
          jenjang: req.body.jenjang,
          thn_masuk: req.body.thn_masuk,
          thn_lulus: req.body.thn_lulus,
          universitas: req.body.universitas,
          fakultas: req.body.fakultas,
          prodi: req.body.prodi,
          user: {
            connect: {
              id: req.user.id,
            },
          },
        },
      });

      return res.json({
        status: 201,
        message: "Data Berhasil Ditambahkan",
      });
    } catch (e) {
      console.error(`Error inserting data: ${e}`);
    }
  }
);

// Fungsi Detail Data - Bettersqlite3
router.get("/:id", function (req, res) {
  const id = req.params.id;

  const query = db.prepare(`SELECT * FROM alumni WHERE id = ${id}`).all();

  if (query.length <= 0) {
    return res.json({
      status: 404,
      message: "Data User tak ditemukan.",
    });
  } else {
    return res.json({
      status: 200,
      message: `Data Dari ${id}`,
      data: query,
    });
  }
});

module.exports = router;
