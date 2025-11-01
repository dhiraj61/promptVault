const { z } = require("zod");

const userZodSchema = z.object({
  name: z.string().min(3, "Name must be atleast Three characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be atleast 6 characters"),
  avatar: z.string().url("please provide valid url").optional(),
});

const loginZodSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be atleast 6 characters"),
});

module.exports = { userZodSchema, loginZodSchema };
