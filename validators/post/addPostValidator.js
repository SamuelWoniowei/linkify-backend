import Joi from "joi";

const addPostValidator = Joi.object({
  userId: Joi.string().required().messages({
    "string.base": "UserId should be a type of text",
    "string.empty": "UserId cannot be an empty field",
    "any.required": "UserId is a required field",
  }),
  content: Joi.string().min(10).required().messages({
    "string.base": "Content should be a type of text",
    "string.empty": "Content cannot be an empty field",
    "string.min": "Content should have a minimum length of {#limit}",
    "any.required": "Content is a required field",
  }),
});

export default addPostValidator;
