const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createPostController,
  displayPostController,
  displayCommunityPostController,
  updatePrompt,
  deletePrompt,
  singlePrompt,
} = require("../controllers/postController");
const router = express.Router();

router.post("/createPost", authMiddleware, createPostController);
router.get("/userPrompt", authMiddleware, displayPostController);
router.get("/allPrompt", displayCommunityPostController);
router.patch("/updatePrompt/:id", authMiddleware, updatePrompt);
router.delete("/deletePrompt/:id", authMiddleware, deletePrompt);
router.get("/singlePrompt/:id", authMiddleware, singlePrompt);

module.exports = router;
