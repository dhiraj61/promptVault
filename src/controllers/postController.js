const jwt = require("jsonwebtoken");
const generateTag = require("../services/aiTag");
const { createPostZodSchema } = require("../validation/promptValidation");
const prmptModel = require("../models/prmptModel");
const userModel = require("../models/userModel");

const createPostController = async (req, res) => {
  const { title, prompt, isPrivate } = req.body;
  const user = req.user;

  let tags = await generateTag(prompt);
  tags = tags.split(",").map((tag) => tag.trim());

  const validatedPromptdata = createPostZodSchema.parse({
    title,
    prompt,
    tags,
    isPrivate,
  });

  try {
    await prmptModel.create({
      title: validatedPromptdata.title,
      prompt: validatedPromptdata.prompt,
      tags: validatedPromptdata.tags,
      isPrivate: validatedPromptdata.isPrivate,
      createdBy: user,
    });
  } catch (error) {
    return res.status(401).json({
      message: error,
    });
  }

  res.status(201).json({
    message: "post created",
  });
};

const displayPostController = async (req, res) => {
  const user = req.user;

  try {
    const prompts = await prmptModel.find({
      createdBy: user,
    });
    res.status(200).json({
      message: prompts,
    });
  } catch (error) {
    res.status(401).json({
      message: "Nothing To Show",
    });
  }
};

const displayCommunityPostController = async (req, res) => {
  const posts = await prmptModel.find({
    isPrivate: false,
  });

  try {
    const postWithUser = await Promise.all(
      posts.map(async (post) => {
        const user = await userModel.findOne({
          _id: post.createdBy,
        });
        const singlePost = {
          avatar: user.avatar,
          name: user.name,
          createAt: post.createdAt,
          prompt: post.prompt,
          tags: post.tags,
        };
        return singlePost;
      })
    );
    res.status(200).json({
      message: postWithUser,
    });
  } catch (error) {
    res.status(401).json({
      message: "No Posts",
    });
  }
};

module.exports = {
  createPostController,
  displayPostController,
  displayCommunityPostController,
};
