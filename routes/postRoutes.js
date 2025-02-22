import express from "express";
import {
  addComment,
  addPost,
  deletePost,
  getAllPosts,
  getOnePost,
  getUserSavedPosts,
  likePost,
  togglePostActiveState,
  updatePost,
} from "../controllers/postControllers.js";
import { validateAddPost } from "../middleware/validate.js";
import authenticateJWT from "../middleware/authenticateJwt.js";
import upload from "../middleware/cloudinary.js";

const router = express.Router();

router.get("/saved", authenticateJWT, getUserSavedPosts);
router.get("/", authenticateJWT, getAllPosts);
router.get("/:id", authenticateJWT, getOnePost);
router.post(
  "/",
  authenticateJWT,
  upload.single("image"),
  validateAddPost,
  addPost
);
router.post("/:id/like", authenticateJWT, likePost);
router.post("/:id/comment", authenticateJWT, addComment);
router.put("/:id", authenticateJWT, updatePost);
router.delete("/:id", authenticateJWT, deletePost);
router.get("/:id/active", authenticateJWT, togglePostActiveState);


export default router;
