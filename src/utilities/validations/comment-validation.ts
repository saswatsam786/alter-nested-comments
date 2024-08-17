import * as Joi from "joi";

export const CREATE_COMMENT_VALIDATION = Joi.object({
  text: Joi.string().min(1).required(),
});

export const PARAMS_COMMENT_VALIDATION = Joi.object({
  postId: Joi.string().length(24).hex().required(),
});

export const REPLY_COMMENT_PARAMS_VALIDATION = Joi.object({
  postId: Joi.string().length(24).hex().required(),
  commentId: Joi.string().length(24).hex().required(),
});
