const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// const authorizeRole = (role) => {
//   return (req, res, next) => {
//     if (req.user.role !== role) {
//       return res.json({
//         status: 403,
//         message: "Akses Ditolak: Anda Bukan Admin",
//       });
//     }
//     next();
//   };
// };

function authorizeRole(req, res, next) {
  // if (!req.user.role) {
  //   return res.json({
  //     status: 403,
  //     message: "Forbidden",
  //   });
  // }
  if (req.user.role === "ADMIN") {
    return next();
  }
  return res.json({
    status: 403,
    message: "Forbidden",
  });
}

module.exports = authorizeRole;
