const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function user(req, res, next) {
  if (req.user.role === "USER") {
    return next();
  }
  return res.json({
    status: 403,
    message: "Forbidden",
  });
}

module.exports = user;
