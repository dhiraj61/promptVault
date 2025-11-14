const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    promptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "prompt",
      required: true,
    },
  },
  { timestamps: true }
);

const like = mongoose.model("likes", likeSchema);

module.exports = like;
