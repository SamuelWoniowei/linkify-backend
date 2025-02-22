import Joi from "joi";

const signupValidator = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email should be a type of text",
    "string.email": "Please provide a valid email address",
    "string.empty": "Email cannot be an empty field",
    "any.required": "Email is a required field",
  }),

  password: Joi.string().min(6).required().messages({
    "string.base": "Password should be a type of text",
    "string.empty": "Password cannot be an empty field",
    "string.min": "Password should have a minimum length of {#limit}",
    "any.required": "Password is a required field",
  }),

  firstname: Joi.string().required().messages({
    "string.base": "First name should be a type of text",
    "string.empty": "First name cannot be an empty field",
    "any.required": "First name is a required field",
  }),

  lastname: Joi.string().required().messages({
    "string.base": "Last name should be a type of text",
    "string.empty": "Last name cannot be an empty field",
    "any.required": "Last name is a required field",
  }),

  username: Joi.string()
    .pattern(/^[a-zA-Z0-9_]+$/)
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.pattern.base": "Username can only contain letters, numbers, and underscores",
      "string.min": "Username should have a minimum length of {#limit}",
      "string.max": "Username should have a maximum length of {#limit}",
      "string.empty": "Username cannot be an empty field",
      "any.required": "Username is a required field",
    }),

  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .messages({
      "string.base": "Phone number should be a type of text",
      "string.empty": "Phone number cannot be an empty field",
      "string.pattern.base": "Phone number must be between 10 and 15 digits",
    }),

});

export default signupValidator;
