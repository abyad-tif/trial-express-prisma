const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.json({
      status: 401,
      message: "Unauthorized",
    });
  }

  jwt.verify(token, "secret", (err, decoded) => {
    if (err) {
      return res.json({
        status: 401,
        message: "Unauthorized",
      });
    }

    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
