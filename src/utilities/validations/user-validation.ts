import * as Joi from "joi";

export const REGISTER_VALIDATION = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
});
