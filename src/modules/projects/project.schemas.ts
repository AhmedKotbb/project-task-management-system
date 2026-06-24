import Joi from "joi";
import { CreateProjectDto, UpdateProjectDto } from "./project.dtos";

export const projectSchemas = {
  createProject: Joi.object<CreateProjectDto>({
    title: Joi.string().required(),
    description: Joi.string().required(),
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

  updateProject: Joi.object<UpdateProjectDto>({
    id: Joi.string().uuid().required(),
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    status: Joi.string().valid("pending", "in_progress", "completed").optional(),
  }),

}