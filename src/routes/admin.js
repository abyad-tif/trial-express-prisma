const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/token");
const authorizeRole = require("../middleware/role");

const { body, validationResult } = require("express-validator");

const prisma = require("../utils/db");

// Fungsi Menampilkan Semua Data
router.get("/", verifyToken, authorizeRole, async function (req, res) {
  try {
    // const user = await prisma.user.findMany();
    const alumni = await prisma.alumni.findMany();
    const pendidikan = await prisma.pendidikan.findMany();
    const pekerjaan = await prisma.pekerjaan.findMany();

    return res.json({
      status: 200,
      message: "Semua Data",
      alumni: alumni,
      pendidikan: pendidikan,
      pekerjaan: pekerjaan,
    });
  } catch (e) {
    console.error(`Error fetching data: ${e}`);
  }
});

// Fungsi Menampilkan Data Berdasarkan Email
router.post(
  "/getDataSpecificUser",
  verifyToken,
  authorizeRole,
  async function (req, res) {
    try {
      const name = await prisma.user.findUnique({
        where: { email: req.body.email },
        select: {
          name: true,
        },
      });
      // const user = await prisma.user.findMany();
      const alumni = await prisma.alumni.findUnique({
        where: { alumni_email: req.body.email },
      });
      const pendidikan = await prisma.pendidikan.findMany({
        where: { alumni_email: req.body.email },
      });
      const pekerjaan = await prisma.pekerjaan.findMany({
        where: { alumni_email: req.body.email },
      });

      return res.json({
        status: 200,
        message: `Semua Data`,
        user: name,
        alumni: alumni,
        pendidikan: pendidikan,
        pekerjaan: pekerjaan,
      });
    } catch (e) {
      console.error(`Error fetching data: ${e}`);
    }
  }
);

module.exports = router;
