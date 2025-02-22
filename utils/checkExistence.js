import mongoose from "mongoose";
import Post from "../models/post.js";
import User from "../models/user.js";
import { handleNotFound } from "./responses.js";

export const checkPostExistence = async (id, res) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return handleNotFound(res, "Invalid post ID format");
  }

  const post = await Post.findById(id)
    .populate("user", "firstname lastname username email")
    .populate("comments.user", "firstname lastname username email")
    .populate("likes", "firstname lastname username email")
    .exec();

  if (!post) {
    return res.status(404).json({ status: "error", message: "Post not found" });
  }

  return post;
};

export const checkUserExistence = async (id, res) => {
  const user = await User.findById(id);
  if (!user) {
    handleNotFound(res, "User not found");
  }
  return user;
};
