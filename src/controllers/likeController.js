const likeModel = require("../models/likeModel");
const promptModel = require('../models/prmptModel')
const { rawListeners } = require("../models/userModel");

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
    likeCount,
  });
};

const fetchLikeController = async (req, res) => {
  const user = req.user;
  const promptId = req.params.id;

  const existingLike = await likeModel
    .findOne({
      userId: user,
      promptId: promptId,
    })
    .select("-_id -userId -createdAt -updatedAt -__v");

  const like = existingLike ? true : false;

  res.status(200).json({
    like,
  });
};

const userLikeCount = async (req, res) => {
  const user = req.user._id;
  const prompts = await promptModel.find({createdBy:user})
  const promptIds = prompts.map(p=>p._id)
  const likeCount = await likeModel.countDocuments({ promptId:{$in:promptIds} });
  res.status(200).json({
    likeCount,
  });
};

const promptLikeCount = async (req, res) => {
  const promptId = req.params.id;
  const likeCount = await likeModel.countDocuments({ promptId: promptId });
  res.status(200).json({
    likeCount,
  });
};

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
    likeCount,
  });
};

module.exports = {
  likePromptController,
  dislikePromptController,
  userLikeCount,
  promptLikeCount,
  fetchLikeController,
};
