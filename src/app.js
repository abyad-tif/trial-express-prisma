const express = require("express");
const usersRouter = require("./routes/users");
const userProfileRouter = require("./routes/alumni");
const verifyToken = require("./middleware/token");
const app = express();
const router = express.Router();
const PORT = 3000;

app.get("/", (req, res) => {
  res.json({
    message: "Express + Prisma + Sqlite",
  });
});

app.use(express.json());
app.use(express.urlencoded());
// app.use(verifyToken);
app.use("/api/getDataUsers", usersRouter);
app.use("/api/getDataAlumni", userProfileRouter);

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});

module.exports = { app, router };
