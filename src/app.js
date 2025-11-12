const express = require("express");
const cors = require("cors");
const authRoute = require("./routes/authRoutes");
const postRoute = require("./routes/postRoutes");
const likeRoutes = require("./routes/likeRoutes");
const app = express();
const allowedOrigin = process.env.FRONTEND_URI

app.use(express.json());
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);
app.use("/api/", likeRoutes);

module.exports = app;
