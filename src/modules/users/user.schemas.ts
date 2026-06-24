import Joi from "joi";
import { CreateUserDto } from "./user.interfaces";

const PASSWORD_COMPLEXITY_MESSAGE =
  "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol";

const passwordComplexitySchema = Joi.string()
  .required()
  .custom((value, helpers) => {
    const isValid =
      value.length >= 8 &&
      value.length <= 10 &&
      /[A-Z]/.test(value) &&
      /[a-z]/.test(value) &&
      /[0-9]/.test(value) &&
      /[^A-Za-z0-9]/.test(value);

    if (!isValid) {
      return helpers.error("any.custom");
    }

    return value;
  })
  .messages({
    "any.custom": PASSWORD_COMPLEXITY_MESSAGE,
  });

export const userSchemas = {
  createUser: Joi.object<CreateUserDto>({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().pattern(/^[0-9]+$/).required(),
    role: Joi.string().valid('admin', 'member').required(),
  }),

  details: Joi.object({
    id: Joi.string().uuid().required(),
  }),

  listAll: Joi.object({
    page: Joi.number().min(1).required(),
    limit: Joi.number().min(1).default(10),
    sortBy: Joi.string().valid("createdAt", "updatedAt").default("createdAt"),
    sort: Joi.string().valid("asc", "desc").default("desc"),
    search: Joi.string().optional(),
  }),

  changePassword: Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: passwordComplexitySchema,
    confirmPassword: passwordComplexitySchema,
  }),

}