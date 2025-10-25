const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  // const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.json({
      status: 401,
      message: "Unauthorized",
      token: token,
    });
  }

  jwt.verify(token, "secret", (err, decoded) => {
    if (err) {
      return res.json({
        status: 403,
        message: "Invalid or Expired",
      });
    }

    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
