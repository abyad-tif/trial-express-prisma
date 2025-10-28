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

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
    if (err) {
      return res.json({
        status: 403,
        message: "Invalid or Expired",
      });
    }

    req.user = user;
    next();
  });
};

module.exports = verifyToken;
