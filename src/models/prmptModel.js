const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
      required: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const prompt = mongoose.model("prompt", promptSchema);

module.exports = prompt;
