import Joi from "joi";

export const authSchemas = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};
