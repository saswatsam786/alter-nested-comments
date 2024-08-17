import * as Joi from "joi";

export const CREATE_POST_VALIDATION = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  content: Joi.string().min(1).required(),
});

export const GET_POST_VALIDATION = Joi.object({
  postId: Joi.string().length(24).hex().required(),
});
