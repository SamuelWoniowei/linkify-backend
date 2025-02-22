import mongoose from "mongoose";
import Post from "../models/post.js";
import {
  checkPostExistence,
  checkUserExistence,
} from "../utils/checkExistence.js";
import {
  handleBadRequest,
  handleError,
  handleNotFound,
  handleSuccess,
} from "../utils/responses.js";

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "firstname lastname username email profilePicture")
      .populate("comments.user", "firstname lastname username email")
      .populate("likes", "firstname lastname username email")
      .sort({ createdAt: -1 });

    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }
    handleSuccess(res, "Posts fetched successfully", posts);
  } catch (error) {
    handleError(res, error, "An error occurred while fetching posts");
  }
};

export const addPost = async (req, res) => {
  const { content } = req.body;
  const imageUrl = req.file?.path;
  const userId = req.user.id;

  try {
    const user = await checkUserExistence(userId, res);
    const newPost = await Post.create({
      user: userId,
      content,
      image: imageUrl || null,
    });

    const populatedPost = await Post.findById(newPost._id).populate(
      "user",
      "firstname lastname email"
    );

    handleSuccess(res, "Post added successfully", populatedPost, 201);
  } catch (error) {
    handleError(res, error, "An error occurred while adding post");
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid post ID format" });
    }
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return res
        .status(404)
        .json({ status: "error", message: "Post not found" });
    }
    handleSuccess(res, "Post deleted successfully", null);
  } catch (error) {
    handleError(res, error, "An error occurred while deleting post");
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { content, image } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return handleNotFound(res, "Invalid post ID format");
  }

  if (!content && !image) {
    return res
      .status(400)
      .send({ message: "Please provide content or image to update." });
  }

  try {
    const post = await checkPostExistence(id, res);
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { content, image },
      { new: true }
    );
    handleSuccess(res, "Your post has been updated successfully", updatedPost);
  } catch (error) {
    handleError(res, error, "An error occurred while updating post");
  }
};

export const likePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.body.id;

  try {
    const post = await checkPostExistence(id, res);

    if (post.saves.some((save) => save._id.equals(userId))) {
      post.likes = post.likes.filter((like) => !like._id.equals(userId));
    } else {
      post.likes.push(userId);
    }

    await post.save();

    const likedPost = await Post.findById(post._id)
      .populate("user", "firstname lastname username email profilePicture")
      .populate("comments.user", "firstname lastname username email")
      .populate("likes", "firstname lastname username email");

    handleSuccess(res, "Post liked successfully", likedPost);
  } catch (error) {
    handleError(res, error, "An error occurred while liking post");
  }
};

export const addComment = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const userId = req.user.id;

  if (!comment) {
    return res.status(400).json({ message: "Comment is required" });
  }

  try {
    const post = await checkPostExistence(id, res);
    console.log(post);

    post.comments.push({
      user: userId,
      comment,
      createdAt: Date.now(),
    });

    await post.save();

    handleSuccess(res, "Comment added successfully", post);
  } catch (error) {
    handleError(res, error, "An error occurred while adding comment");
  }
};

export const togglePostActiveState = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  console.log(userId);
  let message;

  try {
    const post = await checkPostExistence(id, res);
    if (post.saves.some((save) => save.equals(userId))) {
      post.saves = post.saves.filter((save) => !save.equals(userId));
      message = "Post unsaved successfully";
    } else {
      post.saves.push(userId);
      message = "Post saved successfully";
    }

    await post.save();

    return handleSuccess(res, message, post);
  } catch (error) {
    return handleError(
      res,
      error,
      "An error occurred while updating post state"
    );
  }
};

export const getOnePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await checkPostExistence(id, res);
    handleSuccess(res, "Post fetched successfully", post);
  } catch (error) {
    if (error.message === "Invalid post ID format") {
      return handleError(res, error, "Invalid post ID format", 400);
    }
    handleError(res, error, "An error occurred while updating post state");
  }
};

export const getUserSavedPosts = async (req, res) => {
  const userId = req.user.id;
  try {
    const posts = await Post.find({ "saves._id": userId })
      .populate("user", "firstname lastname username email profilePicture")
      .populate("comments.user", "firstname lastname username email")
      .populate("likes", "firstname lastname username email")
      .sort({ "saves.savedAt": -1 });
      
    return handleSuccess(res, "Posts fetched successfully", posts);
  } catch (error) {
    console.log(error);
    return handleError(
      res,
      error,
      "An error occurred while fetching saved posts"
    );
  }
};
