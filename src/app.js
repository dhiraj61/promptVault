const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoute = require("./routes/authRoutes");
const postRoute = require("./routes/postRoutes");
const likeRoutes = require("./routes/likeRoutes");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    credentials: true,
  })
);
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);
app.use("/api/", likeRoutes);

module.exports = app;
