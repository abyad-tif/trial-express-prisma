const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");

// const { verify } = require("crypto");
const verifyToken = require("../middleware/token");
const prisma = require("../utils/db");

// Fungsi Menampilkan Data - BetterSqlite3
router.get("/", verifyToken, async function (req, res) {
  try {
    const user = await prisma.pekerjaan.findMany({
      where: { pekerjaan_id: req.user.id },
    });

    return res.json({
      status: 200,
      message: "Data Pekerjaan",
      data: user,
    });
  } catch (e) {
    console.error(`Error fetching data: ${e}`);
  }
});

let pekerjaanValidation = [
  body("nama_perusahaan").notEmpty(),
  body("jabatan").notEmpty(),
  body("alamat").notEmpty(),
  body("industri").notEmpty(),
  body("thn_masuk").notEmpty(),
  body("thn_keluar").notEmpty(),
];

// Fungsi Memasukkan Data - Non User Login
router.post("/store", pekerjaanValidation, async function (req, res) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      errors: error.array(),
    });
  }

  try {
    await prisma.pekerjaan.create({
      data: {
        nama_perusahaan: req.body.nama_perusahaan,
        jabatan: req.body.jabatan,
        alamat: req.body.alamat,
        industri: req.body.industri,
        thn_masuk: req.body.thn_masuk,
        thn_keluar: req.body.thn_keluar,
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
  "/create",
  pekerjaanValidation,
  verifyToken,
  async function (req, res) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        errors: error.array(),
      });
    }

    try {
      await prisma.pekerjaan.create({
        // where: { alumni_email: req.user.email },
        data: {
          nama_perusahaan: req.body.nama_perusahaan,
          jabatan: req.body.jabatan,
          alamat: req.body.alamat,
          industri: req.body.industri,
          thn_masuk: req.body.thn_masuk,
          thn_keluar: req.body.thn_keluar,
          user: {
            connect: {
              id: req.user.id,
            },
          },
        },
      });

      return res.json({
        status: 201,
        message: "Data berhasil Ditambahkan",
      });
    } catch (e) {
      console.error(`Error inserting data: ${e}`);
    }
  },
);

router.patch(
  "/update/:id",
  pekerjaanValidation,
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
      nama_perusahaan: req.body.nama_perusahaan,
      jabatan: req.body.jabatan,
      alamat: req.body.alamat,
      industri: req.body.industri,
      thn_masuk: req.body.thn_masuk,
      thn_keluar: req.body.thn_keluar,
    };

    try {
      await prisma.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          pekerjaan: {
            update: {
              where: {
                id: id,
              },
              data: updatedData,
            },
          },
        },
      });
      return res.json({
        status: 200,
        message: "Data berhasil diubah",
      });
    } catch (e) {
      console.error(`Error inserting data: ${e}`);
    }
  },
);

router.delete("/pekerjaan/:id", verifyToken, async function (req, res) {
  const id = parseInt(req.params.id);

  try {
    await prisma.pekerjaan.delete({
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
