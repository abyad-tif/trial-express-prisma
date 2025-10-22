const Database = require("better-sqlite3");
const db = new Database("./prisma/dev.db");

module.exports = db;
