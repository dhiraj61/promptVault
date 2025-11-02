const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createPostController, displayPostController, displayCommunityPostController } = require("../controllers/postController");
const router = express.Router();

router.post("/createPost",authMiddleware,createPostController);
router.get('/userPrompt',authMiddleware,displayPostController);
router.get('/allPrompt',displayCommunityPostController);

module.exports = router;
