import { verifyPassword } from "../helpers/password.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import {
  handleBadRequest,
  handleError,
  handleSuccess,
} from "../utils/responses.js";
import Notification from "../models/notification.js";

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export const login = async (req, res) => {
  const { usertag, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ username: usertag }, { email: usertag }],
    });

    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }

    const isPasswordCorrect = await verifyPassword(user.password, password);

    if (!isPasswordCorrect) {
      return res.status(400).send({ error: "Invalid username or password" });
    }
    const userDetails = {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture
    };

    const token = jwt.sign(userDetails, SECRET_KEY, {
      expiresIn: "24h",
    });
    const data = {
      token,
      user: userDetails,
    };
    handleSuccess(res, "You have successfully logged in", data);
  } catch (error) {
    console.log(error);
    handleError(res, error, "An error occurred while trying to login");
  }
};

export const register = async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .send({ error: "Username or email already in use." });
    }
    const user = await User.create({
      firstname,
      lastname,
      username,
      email,
      password,
    });

    await Notification.create({
      user: user._id,
      title: "Welcome to the Party! 🎊",
      message:
        "We're so hyped to have you here. Dive in, explore, and make some noise!",
      type: "success",
    });

    const userDetails = {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture
    };

    const token = jwt.sign(userDetails, SECRET_KEY, {
      expiresIn: "24h",
    });

    const data = {
      token,
      user: userDetails,
    };

    handleSuccess(res, "You have successfully registered", data, 201);
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      handleBadRequest(res, "Username or email already in use.");
    }
    handleError(res, error, "An error occurred while trying to register");
  }
};
