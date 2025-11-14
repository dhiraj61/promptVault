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
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

promptSchema.index({title:"text",prompt:"text",tags:"text"})
promptSchema.index({createdBy:1,createdAt:-1})
promptSchema.index({createdAt:-1})

const prompt = mongoose.model("prompt", promptSchema);

module.exports = prompt;
