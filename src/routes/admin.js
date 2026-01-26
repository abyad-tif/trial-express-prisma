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
router.get("/getDataAllUser", verifyToken, admin, async function (req, res) {
  try {
    const alumni = await prisma.user.findMany({
      where: {
        role: Role["USER"],
      },
      select: {
        alumni: true,
        pendidikan: true,
        pekerjaan: true,
      },
    });

    return res.json({
      status: 200,
      message: "Semua Data",
      alumni: alumni,
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
      const name = await prisma.user.findUnique({
        where: {
          nim: req.body.nim,
        },
        select: {
          alumni: {
            select: {
              name: true,
            },
          },
        },
      });
      const alumni = await prisma.user.findUnique({
        where: {
          nim: req.body.nim,
        },
        select: {
          alumni: true,
        },
      });
      const pendidikan = await prisma.user.findMany({
        where: {
          nim: req.body.nim,
        },
        select: {
          pendidikan: true,
        },
      });
      const pekerjaan = await prisma.user.findMany({
        where: {
          nim: req.body.nim,
        },
        select: {
          pekerjaan: true,
        },
      });

      return res.json({
        status: 200,
        message: `Semua Data`,
        user: name,
        data: [alumni, pendidikan, pekerjaan],
      });
    } catch (e) {
      console.error(`Error fetching data: ${e}`);
    }
  },
);

module.exports = router;
