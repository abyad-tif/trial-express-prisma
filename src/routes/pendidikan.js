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
// router.post("/store", pendidikanValidation, async function (req, res) {
//   const error = validationResult(req);
//   if (!error.isEmpty()) {
//     return res.status(422).json({
//       errors: error.array(),
//     });
//   }

//   try {
//     await prisma.pendidikan.create({
//       data: {
//         jenjang: req.body.jenjang,
//         thn_masuk: req.body.thn_masuk,
//         thn_lulus: req.body.thn_lulus,
//         universitas: req.body.universitas,
//         fakultas: req.body.fakultas,
//         prodi: req.body.prodi,
//       },
//     });

//     return res.json({
//       status: 201,
//       message: "Data Berhasil Ditambahkan",
//     });
//   } catch (e) {
//     console.error(`Error: ${e}`);
//   }
// });

// Fungsi Memasukkan Data - User login
router.post(
  "/create",
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
  },
);

router.patch(
  "/update/:id",
  pendidikanValidation,
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
      jenjang: req.body.jenjang,
      thn_masuk: req.body.thn_masuk,
      thn_lulus: req.body.thn_lulus,
      universitas: req.body.universitas,
      fakultas: req.body.fakultas,
      prodi: req.body.prodi,
    };

    // const user = await prisma.pendidikan.findUnique({
    //   where: {
    //     pendidikan_id: id,
    //     user: {
    //       is: {
    //         id: req.user.id,
    //       },
    //     },
    //   },
    // });

    try {
      await prisma.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          pendidikan: {
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
        message: "Data Berhasil Diubah",
      });
    } catch (e) {
      console.error(`Error updating data: ${e}`);
    }
  },
);

router.delete("/pendidikan/:id", verifyToken, async function (req, res) {
  const id = parseInt(req.params.id);

  try {
    await prisma.pendidikan.delete({
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
