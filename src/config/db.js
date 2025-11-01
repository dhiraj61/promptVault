const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((res) => {
      console.log("Connected to database");
    })
    .catch((e) => {
      console.log(e);
    });
};

module.exports = connectDB;
