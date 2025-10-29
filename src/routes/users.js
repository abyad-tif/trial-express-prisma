const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/token");

const { body, validationResult } = require("express-validator");

const prisma = require("../utils/db");

// Fungsi Menampilkan Data - BetterSqlite3
router.get("/", verifyToken, async function (req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.user.email,
      },
    });

    return res.json({
      status: 200,
      message: "Data Users",
      data: user,
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

// Fungsi Register Data = BetterSqlite3
router.post("/register", userValidation, async function (req, res) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      errors: error.array(),
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const date = new Date();

    await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        password: hashedPassword,
      },
    });

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
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

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
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "30m",
      }
    );

    res.json({
      status: 200,
      access_token: token,
      token_type: "bearer",
      expired_in: 1800,
    });
  } catch (e) {
    console.error(`Error: ${e}`);
  }
});

router.post("/logout", verifyToken, function (req, res) {
  try {
    res.cookie("access_token", req.user.token, {
      httpOnly: true,
      maxAge: 0,
    });

    return res.json({
      status: 200,
      message: "Logout berhasil",
    });
  } catch (e) {
    return res.json({
      status: 400,
      message: "Logout gagal",
      err: `${e}`,
    });
  }
});

// Fungsi Detail Data - Bettersqlite3
router.get("/:id", async function (req, res) {
  const id = req.params.id;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    res.json({
      status: 200,
      message: `Post Dari ${id}`,
    });
  } catch (e) {
    console.error(`Error: ${e}`);
  }

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
