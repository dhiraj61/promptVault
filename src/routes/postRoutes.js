const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createPostController,
  displayPostController,
  displayCommunityPostController,
  updatePrompt,
  deletePrompt,
} = require("../controllers/postController");
const router = express.Router();

router.post("/createPost", authMiddleware, createPostController);
router.get("/userPrompt", authMiddleware, displayPostController);
router.get("/allPrompt", displayCommunityPostController);
router.patch("/updatePrompt/:id", authMiddleware, updatePrompt);
router.delete("/deletePrompt/:id", authMiddleware, deletePrompt);
router.post('/likePrompt/:id',authMiddleware)

module.exports = router;
