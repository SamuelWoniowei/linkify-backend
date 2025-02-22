import express from "express";
import { login, register } from "../controllers/authControllers.js";
import { validateLogin, validateSignup } from "../middleware/validate.js";

const router = express.Router();

router.post("/register", validateSignup, register);
router.post("/login", validateLogin, login);

export default router;
