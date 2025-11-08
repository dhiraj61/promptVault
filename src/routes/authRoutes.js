const express = require("express");
const {registerController,loginController, logoutController} = require("../controllers/authController");
const router = express.Router();
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/register", upload.single("avatar"), registerController);
router.post('/login',loginController)
router.post('/logout',logoutController)

module.exports = router;
