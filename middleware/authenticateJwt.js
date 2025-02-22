import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { handleForbidden } from "../utils/responses.js";
dotenv.config();

const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    handleForbidden(res, "Access denied. No token provided.");
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return handleForbidden(res, "Invalid tokens");
    }

    req.user = decoded;
    next();
  });
};

export default authenticateJWT;
