const jwt = require("jsonwebtoken");
const generateTag = require("../services/aiTag");
const {
  createPostZodSchema,
  updatePostZodSchema,
} = require("../validation/promptValidation");
const prmptModel = require("../models/prmptModel");
const userModel = require("../models/userModel");
const likeModel = require("../models/likeModel");
const { options } = require("../routes/postRoutes");

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
    const prompts = await prmptModel
      .find({
        createdBy: user,
      })
      .sort({ createdAt: -1 })
      .select("title prompt tags isPrivate");
    res.status(200).json({
      data: prompts,
      user,
    });
  } catch (error) {
    res.status(401).json({
      message: "Nothing To Show",
    });
  }
};

const displayCommunityPostController = async (req, res) => {
  try {
    const search = req.query.q?.trim();

    let postWithUser = [];
    if (search) {
      postWithUser = await prmptModel
        .find({ isPrivate: false, $text: { $search: search } })
        .sort(
          search
            ? { score: { $meta: "textScore" }, createdAt: -1 }
            : { createdAt: -1 }
        )
        .select("_id title prompt tags createdAt createdBy isPrivate")
        .populate("createdBy", "avatar name")
        .lean();
    } else {
      postWithUser = await prmptModel
        .find({ isPrivate: false })
        .sort({ createdAt: -1 })
        .select("_id title prompt tags createdAt createdBy isPrivate")
        .populate("createdBy", "avatar name")
        .lean();
    }

    if (postWithUser.length === 0 && search) {
      postWithUser = await prmptModel
        .find({
          isPrivate: false,
          $or: [
            { title: { $regex: search, $options: "i" } },
            { prompt: { $regex: search, $options: "i" } },
            { tags: { $regex: search, $options: "i" } },
          ],
        })
        .sort({ createdAt: -1 })
        .select("_id title prompt tags createdAt createdBy isPrivate")
        .populate("createdBy", "avatar name")
        .lean();
    }

    res.status(200).json({
      postWithUser,
    });
  } catch (error) {
    res.status(401).json({
      message: "No Posts",
    });
  }
};

const updatePrompt = async (req, res) => {
  try {
    const promptId = req.params.id;
    const { title, prompt, isPrivate } = req.body;
    let tags = await generateTag(prompt);
    tags = tags.split(",").map((tag) => tag.trim());

    const validatedPromptdata = updatePostZodSchema.parse({
      title,
      prompt,
      tags,
      isPrivate,
    });

    const updatedPrompt = await prmptModel.findByIdAndUpdate(
      promptId,
      { $set: validatedPromptdata },
      { new: true }
    );

    res.status(200).json({
      message: updatedPrompt,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const singlePrompt = async (req, res) => {
  try {
    const promptId = req.params.id;
    const prompt = await prmptModel.findById(promptId);
    if (!prompt) {
      return res.status(401).json({
        message: "Not Found Try Again",
      });
    }
    res.status(200).json({
      prompt,
    });
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

const deletePrompt = async (req, res) => {
  try {
    const promptId = req.params.id;
    const deleted = await prmptModel.findByIdAndDelete(promptId);
    await likeModel.deleteOne({
      promptId: promptId,
    });
    if (!deleted) {
      return res.status(401).json({
        message: "Not Deleted Try Again",
      });
    }
    res.status(200).json({
      message: "Deleted Successfully",
    });
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPostController,
  displayPostController,
  displayCommunityPostController,
  updatePrompt,
  deletePrompt,
  singlePrompt,
};
