const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");

const db = require("../connection/database");

// Fungsi Menampilkan Data - BetterSqlite3
router.get("/", function (req, res) {
  try {
    const query = db.prepare(`SELECT * FROM alumni`).all();

    return res.json({
      status: 200,
      message: "List Data Alumni",
      data: query,
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

// Fungsi Memasukkan Data = BetterSqlite3
router.post("/store", alumniValidation, function (req, res) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      errors: error.array(),
    });
  }

  try {
    const query = db.prepare(
      `INSERT INTO alumni (name, nim, email, gender, no_wa, tmpt_tinggal) VALUES (?, ?, ?, ?, ?, ?)`
    );

    let formData = {
      name: req.body.name,
      nim: req.body.nim,
      email: req.body.email,
      gender: req.body.gender,
      no_wa: req.body.no_wa,
      tmpt_tinggal: req.body.tmpt_tinggal,
    };

    query.run(
      formData.name,
      formData.nim,
      formData.email,
      formData.gender,
      formData.no_wa,
      formData.tmpt_tinggal
    );

    // query.run(formData);

    return res.json({
      status: 201,
      message: "Data berhasil ditambahkan",
    });
  } catch (e) {
    console.error(`Error inserting data: ${e}`);
  }
});

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

// Fungsi Update Berdasarkan ID - BetterSqlite3
// router.patch("/update/:id", profileValidation, function (req, res) {
//   const error = validationResult(req);
//   if (!error.isEmpty()) {
//     return res.status(422).json({
//       errors: error.array(),
//     });
//   }

//   let id = req.params.id;

//   try {
//     const query = db.prepare(
//       `UPDATE users SET email = ?, name = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ${id}`
//     );

//     query.run(req.body.email, req.body.name);

//     return res.json({
//       status: 201,
//       message: "Data berhasil diubah",
//     });
//   } catch (e) {
//     console.error(`Error updating data: ${e}`);
//   }
// });

// router.delete("/delete/:id", function (req, res) {
//   let id = req.params.id;

//   try {
//     const query = db.prepare(`DELETE FROM users WHERE id = ?`).run(id);

//     return res.json({
//       status: 200,
//       message: "Users berhasil dihapus!",
//     });
//   } catch (e) {
//     console.error(`Error deleting users: ${e}`);
//   }
// });

module.exports = router;
