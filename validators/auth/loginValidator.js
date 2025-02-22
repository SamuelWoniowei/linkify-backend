import Joi from "joi";

const loginValidator = Joi.object({
  usertag: Joi.string().required().messages({
    "string.base": "Email or Username should be a type of text",
    "string.empty": "Email or Username cannot be an empty field",
    "any.required": "Email or Username is a required field",
  }),

  password: Joi.string().required().messages({
    "string.base": "Password should be a type of text",
    "string.empty": "Password cannot be an empty field",
    "any.required": "Password is a required field",
  }),
});

export default loginValidator;
