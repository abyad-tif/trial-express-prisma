const express = require("express");
const router = express.Router();

const db = require("../connection/database");

// Fungsi Menampilkan Semua Data
router.get("/", function (req, res) {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "List Data Users!",
        data: db,
      });
    }
  });
});

// Fungsi Memasukkan Data
router.post(
  "/api/users/store",
  [
    body("email").notEmpty(),
    body("username").notEmpty(),
    body("name").notEmpty(),
  ],
  (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        errors: error.array(),
      });
    }

    let formData = {
      email: req.body.email,
      username: req.body.username,
      name: req.body.name,
    };

    db.query("INSERT INTO posts SET ?", formData, function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Internal Server Error",
        });
      } else {
        return res.status(201).json({
          status: true,
          message: "Insert Data Successfully",
          data: rows[0],
        });
      }
    });
  }
);

module.exports = router;
