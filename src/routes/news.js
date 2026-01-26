const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");

const { verify } = require("crypto");
const verifyToken = require("../middleware/token");
const prisma = require("../utils/db");

// Fungsi Menampilkan Data - BetterSqlite3
router.get("/", verifyToken, async function (req, res) {
  try {
    const news = await prisma.news.findMany();

    return res.json({
      status: 200,
      message: "Data News",
      data: news,
    });
  } catch (e) {
    console.error(`Error fetching data: ${e}`);
  }
});

let newsValidation = [
  body("judul").notEmpty(),
  body("author").notEmpty(),
  body("deskripsi").notEmpty(),
];

// Fungsi Memasukkan Data - Non User Login
router.post("/store", newsValidation, async function (req, res) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      errors: error.array(),
    });
  }

  try {
    await prisma.news.create({
      data: {
        judul: req.body.judul,
        author: req.body.author,
        deskripsi: req.body.deskripsi,
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

router.post("/create", newsValidation, verifyToken, async function (req, res) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      errors: error.array(),
    });
  }

  try {
    await prisma.news.create({
      // where: { alumni_email: req.user.email },
      data: {
        judul: req.body.judul,
        author: req.body.author,
        deskripsi: req.body.deskripsi,
      },
    });

    return res.json({
      status: 201,
      message: "Data Berhasil Ditambahkan",
    });
  } catch (e) {
    console.error(`Error inserting data: ${e}`);
  }
});

router.patch(
  "/update/:id",
  newsValidation,
  verifyToken,
  async function (req, res) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        errors: error.array(),
      });
    }

    const id = parseInt(req.params.id);

    try {
      await prisma.news.update({
        where: {
          id: id,
        },
        data: {
          judul: req.body.judul,
          author: req.body.author,
          deskripsi: req.body.deskripsi,
        },
      });

      return res.json({
        status: 200,
        message: "Data Berhasil Diubah",
      });
    } catch (e) {
      console.error(`Error updating data: ${e}`);
    }
  },
);

router.delete("/news/:id", verifyToken, async function (req, res) {
  const id = parseInt(req.params.id);

  try {
    await prisma.news.delete({
      where: {
        id: id,
      },
    });

    return res.json({
      status: 200,
      message: "Data Berhasil Dihapus",
    });
  } catch (e) {
    console.error(`Error deleting data: ${e}`);
  }
});

module.exports = router;
