import express from "express";
import {
  getAllUsers,
  getUser,
  followUser,
  unfollowUser,
  getUserWithPosts,
  updateUserProfile,
  getFriends,
} from "../controllers/userControllers.js";
import authenticateJWT from "../middleware/authenticateJwt.js";
import upload from "../middleware/cloudinary.js";

const router = express.Router();

router.put("/update", authenticateJWT, upload.single('profilePicture'), updateUserProfile);
router.get("/", authenticateJWT, getAllUsers);
router.get("/friends", authenticateJWT, getFriends);
router.get("/:id", authenticateJWT, getUser);
router.get("/:id/follow", authenticateJWT, followUser);
router.get("/:id/unfollow", authenticateJWT, unfollowUser);
router.get("/:id/posts", authenticateJWT, getUserWithPosts);
export default router;
