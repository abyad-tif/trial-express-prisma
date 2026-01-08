const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/token");
const admin = require("../middleware/role");

const { body, validationResult } = require("express-validator");

const { Role } = require("../generated/prisma");
const prisma = require("../utils/db");

// Fungsi Menampilkan Semua Data
router.get("/", verifyToken, admin, async function (req, res) {
  try {
    // const user = await prisma.user.findMany();
    // const role = USER;
    const alumni = await prisma.alumni.findMany({
      where: {
        user: {
          role: Role["USER"],
        },
      },
    });
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
  admin,
  async function (req, res) {
    try {
      const id = await prisma.user.findUnique({
        where: {
          nim: req.body.nim,
        },
        select: {
          id: true,
        },
      });
      const name = await prisma.alumni.findUnique({
        where: id,
        select: {
          name: true,
        },
      });
      const alumni = await prisma.alumni.findUnique({
        where: id,
      });
      const pendidikan = await prisma.pendidikan.findMany({
        where: id,
      });
      const pekerjaan = await prisma.pekerjaan.findMany({
        where: id,
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
  },
);

module.exports = router;
