const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");

const db = require("../connection/database");

// Fungsi Menampilkan Data - BetterSqlite3
router.get("/", function (req, res) {
  try {
    const query = db.prepare(`SELECT * FROM profile`).all();

    return res.json({
      status: 200,
      message: "List Data Users",
      data: query,
    });
  } catch (e) {
    console.error(`Error fetching data: ${e}`);
  }
});

let profileValidation = [
  body("name").notEmpty(),
  body("nim").notEmpty(),
  body("fakultas").notEmpty(),
  body("prodi").notEmpty(),
  body("thn_masuk").notEmpty(),
  body("thn_lulus").notEmpty(),
  body("gender").notEmpty(),
  body("no_wa").notEmpty(),
  body("email").isEmail(),
  body("tmpt_tinggal").notEmpty(),
  body("perusahaan").notEmpty(),
  body("tmpt_kerja").notEmpty(),
  body("posisi").notEmpty(),
];

// Fungsi Memasukkan Data = BetterSqlite3
router.post("/store", profileValidation, function (req, res) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      errors: error.array(),
    });
  }

  try {
    const id = db.prepare(`SELECT id from users`).all();

    const query = db.prepare(
      `INSERT INTO profile (name, nim, fakultas, prodi, thn_masuk, thn_lulus, gender, no_wa, email, tmpt_tinggal, perusahaan, tmpt_kerja, posisi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    let formData = {
      name: req.body.name,
      nim: req.body.nim,
      fakultas: req.body.fakultas,
      prodi: req.body.prodi,
      thn_masuk: req.body.thn_masuk,
      thn_lulus: req.body.thn_lulus,
      gender: req.body.gender,
      no_wa: req.body.no_wa,
      email: req.body.email,
      tmpt_tinggal: req.body.tmpt_tinggal,
      perusahaan: req.body.perusahaan,
      tmpt_kerja: req.body.tmpt_kerja,
      posisi: req.body.posisi,
    };

    query.run(
      formData.name,
      formData.nim,
      formData.fakultas,
      formData.prodi,
      formData.thn_masuk,
      formData.thn_lulus,
      formData.gender,
      formData.no_wa,
      formData.email,
      formData.tmpt_tinggal,
      formData.perusahaan,
      formData.tmpt_kerja,
      formData.posisi
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

  const query = db.prepare(`SELECT * FROM users WHERE id = ${id}`).all();

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
router.patch("/update/:id", profileValidation, function (req, res) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      errors: error.array(),
    });
  }

  let id = req.params.id;

  try {
    const query = db.prepare(
      `UPDATE users SET email = ?, name = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ${id}`
    );

    query.run(req.body.email, req.body.name);

    return res.json({
      status: 201,
      message: "Data berhasil diubah",
    });
  } catch (e) {
    console.error(`Error updating data: ${e}`);
  }
});

router.delete("/delete/:id", function (req, res) {
  let id = req.params.id;

  try {
    const query = db.prepare(`DELETE FROM users WHERE id = ?`).run(id);

    return res.json({
      status: 200,
      message: "Users berhasil dihapus!",
    });
  } catch (e) {
    console.error(`Error deleting users: ${e}`);
  }
});

module.exports = router;
