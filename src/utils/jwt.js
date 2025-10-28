const jwt = require("jsonwebtoken");
const crypto = require("crypto");

function generateToken(user) {
  return jwt.sign({ email: user.email }, process.env.JST_ACCESS_SECRET, {
    expiresIn: "30m",
  });
}

function generateRefreshToken() {
  const token = crypto.randomBytes(16).toString("base64url");
  return token;
}

module.exports = { generateToken, generateRefreshToken };
