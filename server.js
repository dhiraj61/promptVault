require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

connectDB();

app.listen(process.env.CORS_ORIGIN, () => {
  console.log("server running on 3000 port");
});
