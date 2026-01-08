const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");

const { verify } = require("crypto");
const verifyToken = require("../middleware/token");
const prisma = require("../utils/db");

// Fungsi Menampilkan Data - BetterSqlite3
router.get("/", verifyToken, async function (req, res) {
  try {
    const loker = await prisma.loker.findMany();

    return res.json({
      status: 200,
      message: "Data Loker",
      data: loker,
    });
  } catch (e) {
    console.error(`Error fetching data: ${e}`);
  }
});

let lokerValidation = [
  body("judul").notEmpty(),
  body("deskripsi").notEmpty(),
  body("nama_perusahaan").notEmpty(),
  body("industri").notEmpty(),
  body("alamat").notEmpty(),
  body("tgl_terbit").notEmpty(),
  body("tgl_kadaluarsa").notEmpty(),
];

// Fungsi Memasukkan Data - Non User Login
router.post("/store", lokerValidation, async function (req, res) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      errors: error.array(),
    });
  }

  try {
    await prisma.loker.create({
      data: {
        judul: req.body.judul,
        deskripsi: req.body.deskripsi,
        nama_perusahaan: req.body.nama_perusahaan,
        industri: req.body.industri,
        alamat: req.body.alamat,
        tgl_terbit: req.body.tgl_terbit,
        tgl_kadaluarsa: req.body.tgl_kadaluarsa,
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

router.post("/create", lokerValidation, verifyToken, async function (req, res) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      errors: error.array(),
    });
  }

  try {
    await prisma.loker.create({
      // where: { alumni_email: req.user.email },
      data: {
        judul: req.body.judul,
        deskripsi: req.body.deskripsi,
        nama_perusahaan: req.body.nama_perusahaan,
        industri: req.body.industri,
        alamat: req.body.alamat,
        tgl_terbit: req.body.tgl_terbit,
        tgl_kadaluarsa: req.body.tgl_kadaluarsa,
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
  lokerValidation,
  verifyToken,
  async function (req, res) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        errors: error.array(),
      });
    }

    const id = parseInt(req.params.id);

    const updatedData = {
      judul: req.body.judul,
      deskripsi: req.body.deskripsi,
      nama_perusahaan: req.body.nama_perusahaan,
      industri: req.body.industri,
      alamat: req.body.alamat,
      tgl_terbit: req.body.tgl_terbit,
      tgl_kadaluarsa: req.body.tgl_kadaluarsa,
    };

    try {
      await prisma.loker.update({
        where: {
          id: id,
        },
        data: {
          judul: req.body.judul,
          deskripsi: req.body.deskripsi,
          nama_perusahaan: req.body.nama_perusahaan,
          industri: req.body.industri,
          alamat: req.body.alamat,
          tgl_terbit: req.body.tgl_terbit,
          tgl_kadaluarsa: req.body.tgl_kadaluarsa,
        },
      });

      return res.json({
        status: 200,
        message: "Data Berhasil Diubah",
      });
    } catch (e) {
      console.error(`Error updating data: ${e}`);
    }
  }
);

router.delete("/loker/:id", verifyToken, async function (req, res) {
  const id = parseInt(req.params.id);

  try {
    await prisma.loker.delete({
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

// Fungsi Memasukkan Data - User login
router.patch(
  "/update",
  lokerValidation,
  verifyToken,
  async function (req, res) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        errors: error.array(),
      });
    }

    try {
      await prisma.loker.update({
        where: { alumni_email: req.user.email },
        data: {
          judul: req.body.judul,
          deskripsi: req.body.deskripsi,
          nama_perusahaan: req.body.nama_perusahaan,
          industri: req.body.industri,
          alamat: req.body.alamat,
          tgl_terbit: req.body.tgl_terbit,
          tgl_kadaluarsa: req.body.tgl_kadaluarsa,
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
