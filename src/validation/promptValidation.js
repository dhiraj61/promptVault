const { z } = require("zod");

const createPostZodSchema = z.object({
  title: z.string().min(2, "Minimum two characters").max(100, "Title too long"),
  prompt: z.string().min(10, "Minimum ten characters"),
  tags: z
    .array(z.string().min(1, "cannot be empty"))
    .max(3, "Maximum 3 tags allowed")
    .default([]),
  isPrivate: z.boolean().optional().default(false),
});

const updatePostZodSchema = z.object({
  title: z.string().min(2, "Minimum two characters").max(100, "Title too long").optional(),
  prompt: z.string().min(10, "Minimum ten characters").optional(),
  tags: z
    .array(z.string().min(1, "cannot be empty"))
    .max(3, "Maximum 3 tags allowed")
    .default([]).optional(),
  isPrivate: z.boolean().optional().default(false),
});

module.exports = {
  createPostZodSchema,
  updatePostZodSchema
};
