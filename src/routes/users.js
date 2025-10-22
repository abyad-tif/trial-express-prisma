const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");

const db = require("../connection/database");

// Fungsi Menampilkan Semua Data - Sqlite3
// router.get("/", function (req, res) {
//   db.all("SELECT * FROM users", (err, rows) => {
//     if (err) {
//       return res.status(500).json({
//         message: err.message,
//       });
//     } else {
//       return res.status(200).json({
//         status: true,
//         message: "List Data Users!",
//         data: db,
//       });
//     }
//   });
// });

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

// Fungsi Memasukkan Data
// router.post("/store", userValidation, (req, res) => {
//   const error = validationResult(req);
//   if (!error.isEmpty()) {
//     return res.status(422).json({
//       errors: error.array(),
//     });
//   }

//   // const { email, username, name } = req.body;

//   // try {
//   //   return res.status(200).json({
//   //     email: email,
//   //     username: username,
//   //     name: name,
//   //   });
//   // } catch (e) {
//   //   console.error(`Error: ${e}`);
//   // }

//   const body = req.body;

//   let formData = {
//     email: body.email,
//     name: body.name,
//   };

//   // return res.json(formData);

//   // let formData = {
//   //   email: userValidationRules.body.email,
//   //   username: userValidationRules.body.username,
//   //   name: userValidationRules.body.name,
//   // };

//   db.run(`INSERT INTO users VALUE ?`, formData, function (err, rows) {
//     if (err) {
//       return res.status(500).json({
//         status: false,
//         message: "Internal Server Error",
//       });
//     } else {
//       return res.status(201).json({
//         status: true,
//         message: "Insert Data Successfully",
//         data: rows[0],
//       });
//     }
//   });
// });

module.exports = router;
