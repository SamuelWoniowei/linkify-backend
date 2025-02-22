import validate from "../utils/validators.js";
import loginValidator from "../validators/auth/loginValidator.js";
import signupValidator from "../validators/auth/signupValidator.js";
import addPostValidator from "../validators/post/addPostValidator.js";

export const validateLogin = validate(loginValidator);
export const validateSignup = validate(signupValidator);
export const validateAddPost = validate(addPostValidator);
