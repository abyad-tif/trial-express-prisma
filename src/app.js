const express = require("express");
const usersRouter = require("./routes/users");
const userAlumniRouter = require("./routes/alumni");
const userPendidikanRouter = require("./routes/pendidikan");
const userPekerjaanRouter = require("./routes/pekerjaan");
const auth = require("./routes/auth");
const admin = require("./routes/admin");
const verifyToken = require("./middleware/token");
const app = express();
const router = express.Router();
const PORT = 3000;

const { PrismaClient } = require("../src/generated/prisma");
const prisma = new PrismaClient();

app.get("/", (req, res) => {
  res.json({
    message: "Express + Prisma + Sqlite",
  });
});

app.use(express.json());
app.use(express.urlencoded());
// app.use(verifyToken);
app.use("/api/auth", auth);
app.use("/api/getDataUsers", usersRouter);
app.use("/api/getDataAlumni", userAlumniRouter);
app.use("/api/getDataPendidikan", userPendidikanRouter);
app.use("/api/getDataPekerjaan", userPekerjaanRouter);
app.use("/api/admin", admin);

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});

module.exports = { app, router };
