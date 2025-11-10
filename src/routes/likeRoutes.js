const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const { likePromptController, dislikePromptController, userLikeCount, fetchLikeController, promptLikeCount, likedPromptController } = require('../controllers/likeController')
const router = express.Router()

router.post('/like/:id',authMiddleware,likePromptController)
router.delete('/dislike/:id',authMiddleware,dislikePromptController)
router.get('/totalLike',authMiddleware,userLikeCount)
router.get('/fetchLike/:id',authMiddleware,fetchLikeController)
router.get('/promptLike/:id',authMiddleware,promptLikeCount)
router.get('/likedPrompt',authMiddleware,likedPromptController)

module.exports = router