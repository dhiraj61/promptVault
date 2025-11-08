const likeModel = require("../models/likeModel");

const likePromptController = async (req, res) => {
  const user = req.user;
  const promptId = req.params.id;

  const existingLike = await likeModel.findOne({
    userId: user,
    promptId: promptId,
  });

  if (existingLike) {
    return res.status(400).json({
      message: "You Alredy Liked It",
    });
  }

  const like = await likeModel.create({
    userId: user,
    promptId: promptId,
  });

  const likeCount = await likeModel.countDocuments({ promptId: promptId });

  res.status(200).json({
    message: likeCount,
  });
};

const userLikeCount = async(req,res) => {
  const user = req.user
  const likeCount = await likeModel.countDocuments({userId:user})
  res.status(200).json({
    likeCount
  })
}

const dislikePromptController = async (req, res) => {
  const user = req.user;
  const promptId = req.params.id;

  const dislike = await likeModel.findOneAndDelete({
    userId: user,
    promptId: promptId,
  });

  if (!dislike) {
    return res.status(400).json({
      message: "Already Disliked",
    });
  }

  const likeCount = await likeModel.countDocuments({ promptId: promptId });

  res.status(200).json({
    message: likeCount,
  });
};

module.exports = { likePromptController, dislikePromptController,userLikeCount };
