const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const uploadFile = require("../services/imgStorage");
const { nanoid } = require("nanoid");
const {
  userZodSchema,
  loginZodSchema,
} = require("../validation/userValidation");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const file = req.file;

    const validatedData = userZodSchema.parse({ name, email, password });

    const existingUser = await userModel.findOne({
      email: validatedData.email,
    });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    let imgUrl = "";
    if (file) {
      if (!file.mimetype.startsWith("image/")) {
        return res.status(400).json({ message: "Only image files allowed" });
      }
      const result = await uploadFile(file.buffer, nanoid());
      imgUrl = result.url;
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const user = await userModel.create({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      avatar: imgUrl,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validatedData = loginZodSchema.parse({ email, password });

    const user = await userModel.findOne({ email: validatedData.email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(validatedData.password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logoutController = async (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};

module.exports = {
  loginController,
  registerController,
  logoutController,
};
