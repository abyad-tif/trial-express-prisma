const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./prisma/dev.db", (err) => {
  if (err) {
    console.error("Error Connecting to Database", err.message);
  } else {
    console.log("Connected to SQLite Database");
  }
});

module.exports = db;
