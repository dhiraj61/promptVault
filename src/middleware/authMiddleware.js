const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorise User",
    });
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET);

  if (!decode) {
    return res.status(401).json({
      message: "Unauthorise User",
    });
  }

  const user = await userModel
    .findOne({
      _id: decode.id,
    })
    .select("-password");

  req.user = user;
  next();
};

module.exports = authMiddleware;
