import Joi from "joi";
import { AssignTaskDTO, CreateTaskDTO, UpdateStatusDTO, UpdateTaskDTO } from "./task.dtos";


export const taskSchemas = {
  createTask: Joi.object<CreateTaskDTO>({
    projectId: Joi.string().uuid().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    dueDate: Joi.string().required(),
    status: Joi.string().valid("pending", "in_progress", "done").optional(),
    priority: Joi.string().valid("low", "medium", "high").optional(),
    assignedTo: Joi.string().uuid().optional(),
  }),

  updateTask: Joi.object<UpdateTaskDTO>({
    id: Joi.string().uuid().required(),
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    status: Joi.string().valid("pending", "in_progress", "done").optional(),
    priority: Joi.string().valid("low", "medium", "high").optional(),
    dueDate: Joi.string().optional(),
  }),

  assignTask: Joi.object<AssignTaskDTO>({
    id: Joi.string().uuid().required(),
    assignedTo: Joi.string().uuid().required(),
  }),

  listAllTasks: Joi.object({
    page: Joi.number().min(1).required(),
    limit: Joi.number().min(1).default(10),
    sortBy: Joi.string().valid("createdAt", "updatedAt").default("createdAt"),
    sort: Joi.string().valid("asc", "desc").default("desc"),
    search: Joi.string().optional(),
    priority: Joi.string().valid("low", "medium", "high").optional(),
    status: Joi.string().valid("pending", "in_progress", "done").optional(),
    assignedTo: Joi.string().uuid().optional(),
  }),

  details: Joi.object({
    id: Joi.string().uuid().required(),
  }),

  updateStatus: Joi.object<UpdateStatusDTO>({
    id: Joi.string().uuid().required(),
    status: Joi.string().valid("pending", "in_progress", "done").required(),
  }),
};