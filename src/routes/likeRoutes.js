const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const { likePromptController, dislikePromptController, userLikeCount } = require('../controllers/likeController')
const router = express.Router()

router.post('/like/:id',authMiddleware,likePromptController)
router.delete('/dislike/:id',authMiddleware,dislikePromptController)
router.get('/totalLike',authMiddleware,userLikeCount)

module.exports = router