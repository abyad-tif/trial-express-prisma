const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/token");
const authorizeRole = require("../middleware/role");

const { body, validationResult } = require("express-validator");

const prisma = require("../utils/db");

// Fungsi Menampilkan Data
router.get("/", verifyToken, authorizeRole, async function (req, res) {
  try {
    const user = await prisma.user.findMany();

    return res.json({
      status: 200,
      message: "Data Semua Users",
      data: user,
    });
  } catch (e) {
    console.error(`Error fetching data: ${e}`);
  }
});

module.exports = router;
