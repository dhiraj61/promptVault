const express = require("express");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/authRoutes");
const postRoute = require('./routes/postRoutes');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use('/api/post',postRoute)

module.exports = app;
