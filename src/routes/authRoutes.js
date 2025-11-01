const express = require("express");
const {registerController,loginController} = require("../controllers/authController");
const router = express.Router();
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/register", upload.single("avatar"), registerController);
router.post('/login',loginController)

module.exports = router;
