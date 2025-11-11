const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const uploadFile = require("../services/imgStorage");
const { nanoid } = require("nanoid");
const {
  userZodSchema,
  loginZodSchema,
} = require("../validation/userValidation");
const { TurnCoverage } = require("@google/genai");

const registerController = async (req, res) => {
  const { name, email, password } = req.body;
  const file = req.file;

  const validatedData = userZodSchema.parse({ name, email, password });

  const existingUser = await userModel.findOne({
    email: validatedData.email,
  });

  if (existingUser) {
    return res.status(400).json({
      message: "email already exist",
    });
  }

  if (file) {
    if (!file.mimetype.startsWith("image/")) {
      return re.status(400).json({
        message: "Onaly Image allowed",
      });
    }
  }
  const result = await uploadFile(file?.buffer, nanoid());
  const imgUrl = result.url;

  const hashedPassword = await bcrypt.hash(validatedData.password, 10);

  const user = await userModel.create({
    name: validatedData.name,
    email: validatedData.email,
    password: hashedPassword,
    avatar: imgUrl,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: "Usere Created!",
  });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;

  const validatedData = loginZodSchema.parse({ email, password });

  const validUser = await userModel.findOne({
    email: validatedData.email,
  });

  if (!validUser) {
    return res.status(401).json({
      message: "Invalid Credetials",
    });
  }

  const checkPassword = await bcrypt.compare(
    validatedData.password,
    validUser.password
  );
  if (!checkPassword) {
    return res.status(401).json({
      message: "Invalid Credetials",
    });
  }

  const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: "User Logged In!",
  });
};

const logoutController = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  res.status(200).json({
    message: "User Logged Out Successfully",
  });
};

module.exports = {
  loginController,
  registerController,
  logoutController,
};
