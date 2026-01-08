const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function admin(req, res, next) {
  if (req.user.role === "ADMIN") {
    return next();
  }
  return res.json({
    status: 403,
    message: "Forbidden",
  });
}

module.exports = admin;
