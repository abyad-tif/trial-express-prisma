const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { body, validationResult } = require("express-validator");

const db = require("../connection/database");

// Fungsi Menampilkan Data - BetterSqlite3
router.get("/", function (req, res) {
  try {
    const query = db.prepare(`SELECT * FROM users`).get();

    return res.json({
      status: 200,
      message: "List Data Users",
      data: query,
    });
  } catch (e) {
    console.error(`Error fetching data: ${e}`);
  }
});

let userValidation = [
  body("email").isEmail(),
  body("name").notEmpty(),
  body("password").notEmpty(),
];

// Fungsi Memasukkan Data = BetterSqlite3
router.post("/register", userValidation, async function (req, res) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      errors: error.array(),
    });
  }

  try {
    const query = db.prepare(
      `INSERT INTO users (email, name, password, updatedAt) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`
    );

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    query.run(req.body.email, req.body.name, hashedPassword);

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
    const user = db
      .prepare(`SELECT * FROM users WHERE email = (?)`)
      .get(req.body.email);

    // if (user) {
    //   return res.json({
    //     data: user.email,
    //   });
    // }

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
      "secret"
    );

    res.json({
      status: 200,
      token: token,
    });
  } catch (e) {
    console.error(`Error: ${e}`);
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
