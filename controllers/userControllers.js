import Notification from "../models/notification.js";
import Post from "../models/post.js";
import User from "../models/user.js";
import { checkUserExistence } from "../utils/checkExistence.js";
import { handleError, handleSuccess } from "../utils/responses.js";

export const getAllUsers = async (req, res) => {
  const { q } = req.query;
  if (q) {
    return findUser(req, res);
  }
  try {
    const users = await User.find({});

    if (users.length === 0) {
      return res.send({ error: "No users found" });
    }
    handleSuccess(res, "Users fetched successfully", users);
  } catch (error) {
    handleError(res, error, "An error occurred while fetching users");
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await checkUserExistence(id, res);
    handleSuccess(res, "User fetched successfully", user);
  } catch (error) {
    handleError(res, error, "An error occurred while fetching user");
  }
};

export const findUser = async (req, res) => {
  const { q } = req.query;
  console.log(q);
  try {
    const user = await User.find({
      $or: [
        { username: { $regex: q, $options: "i" } },
        { first_name: { $regex: q, $options: "i" } },
        { last_name: { $regex: q, $options: "i" } },
      ],
    });
    handleSuccess(res, "User found successfully", user);
  } catch (error) {
    handleError(res, error, "An error occurred while finding user");
  }
};

export const followUser = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    if (id === userId) {
      return handleError(res, null, "You cannot follow yourself");
    }

    const user = await checkUserExistence(id, res);
    const username = user.username;

    const currentUser = await checkUserExistence(userId, res);

    if (currentUser.following.includes(id)) {
      return handleError(res, null, `You are already following ${username}`);
    }

    currentUser.following.push(id);

    user.followers.push(userId);

    await currentUser.save();
    await user.save();

    await Notification.create({
      userId: id,
      title: "You've Got a New Follower! 🎉",
      message: `${username} is now following you`,
      type: "success",
    });

    return handleSuccess(res, `You are now following ${username}`, user);
  } catch (error) {
    return handleError(
      res,
      error,
      `An error occurred while following ${username}`
    );
  }
};

export const getFriends = async (req, res) => {
  const userId = req.user.id;

  try {
    const currentUser = await User.findById(userId)
      .populate("following")
      .populate("followers");

    if (!currentUser) {
      return handleError(res, null, "User not found");
    }

    const mutualFriends = currentUser.following.filter((followingUser) =>
      currentUser.followers.some(
        (follower) => follower._id.toString() === followingUser._id.toString()
      )
    );

    const mutualFriendsData = await User.find({
      _id: { $in: mutualFriends.map((user) => user._id) },
    }).select("username _id profilePicture firstname lastname");

    return handleSuccess(res, "Mutual friends fetched successfully", {
      friends: mutualFriendsData,
    });
  } catch (error) {
    console.error("Error fetching mutual friends:", error);
    return handleError(
      res,
      error,
      "An error occurred while fetching mutual friends"
    );
  }
};

export const unfollowUser = async (req, res) => {
  const { id } = req.params;  
  const userId = req.user.id; 

  try {
    if (id === userId) {
      return handleError(res, null, "You cannot unfollow yourself");
    }

    const user = await checkUserExistence(id, res); 
    const username = user.username;
    const currentUser = await checkUserExistence(userId, res);

    if (!currentUser.following.includes(id)) {
      return handleError(res, null, "You are not following this user");
    }

    currentUser.following = currentUser.following.filter(
      (follow) => follow.toString() !== id.toString()
    );

    user.followers = user.followers.filter(
      (follower) => follower.toString() !== userId.toString()
    );

    await currentUser.save();
    await user.save();

    await Notification.create({
      userId: id,
      title: "Someone Took a Step Back 👀",
      message: `${username} unfollowed you. No biggie, you're still amazing! Keep shining. ✨`,
      type: "info",
    });

    return handleSuccess(res, "You are now unfollowing this user", user);
  } catch (error) {
    return handleError(
      res,
      error,
      `An error occurred while unfollowing ${username}`
    );
  }
};

export const getUserWithPosts = async (req, res) => {
  const { id } = req.params;
  const { username } = req.query;
  try {
    let user;
    let posts;
    if (!username) {
      user = await checkUserExistence(id, res);
      posts = await Post.find({ user: id });
    } else {
      try {
        user = await User.find({ username: id });
        user = user[0];
        posts = await Post.find({ user: user._id });
      } catch (error) {
        return handleError(res, error, "An error occurred while fetching user");
      }
    }

    return handleSuccess(res, "User fetched successfully", { user, posts });
  } catch (error) {
    console.log(error);
    return handleError(res, error, "An error occurred while fetching user");
  }
};

export const updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const updates = req.body;
  const imageUrl = req.file?.path;

  try {
    if (imageUrl) {
      updates.profilePicture = imageUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );
    return handleSuccess(res, "Profile updated successfully", updatedUser);
  } catch (err) {
    console.log(err);
    handleError(res, err, "An error occurred while updating profile");
  }
};
