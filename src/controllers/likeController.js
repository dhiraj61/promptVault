const likeModel = require("../models/likeModel");
const promptModel = require("../models/prmptModel");
const userModel = require("../models/userModel");
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
    isLiked:true
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

const likedPromptController = async (req, res) => {
  const user = req.user._id;
  const likedPrompt = await likeModel.find({
    userId: user,
  });

  const id = likedPrompt.map((p) => p.promptId);

  const prompts = await promptModel.find({
    _id: { $in: id },
  });

  try {
    const postWithUser = await Promise.all(
      prompts.map(async (prompt) => {
        const user = await userModel.findOne({
          _id: prompt.createdBy,
        });
        const singlePost = {
          avatar: user.avatar,
          name: user.name,
          createdAt: prompt.createdAt,
          prompt: prompt.prompt,
          tags: prompt.tags,
          title: prompt.title,
          _id: prompt._id,
        };
        return singlePost;
      })
    );
    res.status(200).json({
      postWithUser,
    });
  } catch (error) {
    res.status(401).json({
      message: "No liked Posts",
    });
  }
};

const userLikeCount = async (req, res) => {
  const user = req.user._id;
  const prompts = await promptModel.find({ createdBy: user });
  const promptIds = prompts.map((p) => p._id);
  const likeCount = await likeModel.countDocuments({
    promptId: { $in: promptIds },
  });
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
    isLiked:false
  });
};

module.exports = {
  likePromptController,
  dislikePromptController,
  userLikeCount,
  promptLikeCount,
  fetchLikeController,
  likedPromptController,
};
