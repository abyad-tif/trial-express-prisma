const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");

const db = require("../connection/database");

// Fungsi Menampilkan Data - BetterSqlite3
router.get("/", function (req, res) {
  try {
    const query = db.prepare(`SELECT * FROM users`).all();

    return res.json({
      status: 200,
      message: "List Data Users",
      data: query,
    });
  } catch (e) {
    console.error(`Error fetching data: ${e}`);
  }
});

let userValidation = [body("email").isEmail(), body("name").notEmpty()];

// Fungsi Memasukkan Data = BetterSqlite3
router.post("/store", userValidation, function (req, res) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      errors: error.array(),
    });
  }

  try {
    const query = db.prepare(
      `INSERT INTO users (email, name, updatedAt) VALUES (?, ?, CURRENT_TIMESTAMP)`
    );

    query.run(req.body.email, req.body.name);

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
router.patch("/update/:id", userValidation, function (req, res) {
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

module.exports = router;
