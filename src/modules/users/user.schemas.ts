import Joi from "joi";
import { CreateUserDto } from "./user.interfaces";


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

}