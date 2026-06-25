import { taskSchemas } from "../../../modules/tasks/task.schemas";
import { commonResponses } from "../components/responses";
import {
  emptySuccessResponse,
  errorResponse,
  joiRequestBody,
  joiToPathParameters,
  joiToQueryParameters,
  successResponse,
} from "../helpers";

const bearerSecurity = [{ bearerAuth: [] as string[] }];
const adminSecurity = [{ bearerAuth: [] as string[] }];

const taskExample = {
  id: "550e8400-e29b-41d4-a716-446655440020",
  projectId: "550e8400-e29b-41d4-a716-446655440010",
  title: "Design homepage mockup",
  description: "Create wireframes and mockups for the homepage",
  status: "in_progress",
  priority: "high",
  dueDate: "2026-07-01T00:00:00.000Z",
  assignedTo: "550e8400-e29b-41d4-a716-446655440002",
  isDeleted: false,
  creator: {
    id: "550e8400-e29b-41d4-a716-446655440001",
    fullName: "Admin User",
    email: "admin@example.com",
    phoneNumber: "1234567890",
  },
  project: {
    id: "550e8400-e29b-41d4-a716-446655440010",
    title: "Website Redesign",
    status: "in_progress",
    description: "Redesign the company website with a modern UI",
  },
  assignee: {
    id: "550e8400-e29b-41d4-a716-446655440002",
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    phoneNumber: "0987654321",
  },
  createdAt: "2026-06-01T08:00:00.000Z",
  updatedAt: "2026-06-25T10:30:45.000Z",
};

export const taskPaths = {
  "/tasks/create": {
    post: {
      tags: ["Tasks"],
      summary: "Create a new task",
      description: "Create a task within a project. **Requires admin role.**",
      operationId: "createTask",
      security: adminSecurity,
      requestBody: joiRequestBody(taskSchemas.createTask),
      responses: {
        201: emptySuccessResponse(
          201,
          "Task created successfully",
          "Task created successfully",
        ),
        400: errorResponse(
          "Validation failure or duplicate task title in project",
          400,
          "Bad Request",
          "Task with this title already exists in this project",
        ),
        401: commonResponses.Unauthorized,
        403: commonResponses.Forbidden,
        500: commonResponses.InternalServerError,
      },
    },
  },

  "/tasks/update": {
    patch: {
      tags: ["Tasks"],
      summary: "Update a task",
      description: "Update task fields. **Requires admin role.**",
      operationId: "updateTask",
      security: adminSecurity,
      requestBody: joiRequestBody(taskSchemas.updateTask),
      responses: {
        200: successResponse(
          200,
          "Task updated successfully",
          { $ref: "#/components/schemas/Task" },
          "Task updated successfully",
          taskExample,
        ),
        400: errorResponse(
          "Validation failure, duplicate title, or invalid status transition",
          400,
          "Bad Request",
          "Cannot mark a pending task as done",
        ),
        401: commonResponses.Unauthorized,
        403: commonResponses.Forbidden,
        404: errorResponse(
          "Task not found",
          404,
          "Not Found",
          "Task not found",
        ),
        500: commonResponses.InternalServerError,
      },
    },
  },

  "/tasks/assign": {
    patch: {
      tags: ["Tasks"],
      summary: "Assign a task to a user",
      description: "Assign or reassign a task to a user. **Requires admin role.**",
      operationId: "assignTask",
      security: adminSecurity,
      requestBody: joiRequestBody(taskSchemas.assignTask),
      responses: {
        200: successResponse(
          200,
          "Task assigned successfully",
          { $ref: "#/components/schemas/Task" },
          "Task assigned successfully",
          taskExample,
        ),
        400: errorResponse(
          "Cannot assign to a deleted user",
          400,
          "Bad Request",
          "You cannot assign a task to a deleted user",
        ),
        401: commonResponses.Unauthorized,
        403: commonResponses.Forbidden,
        404: errorResponse(
          "Task or assignee not found",
          404,
          "Not Found",
          "User not found",
        ),
        500: commonResponses.InternalServerError,
      },
    },
  },

  "/tasks/update-status": {
    patch: {
      tags: ["Tasks"],
      summary: "Update task status",
      description:
        "Update the status of a task. Only the assigned user or an admin may perform this action.",
      operationId: "updateTaskStatus",
      security: bearerSecurity,
      requestBody: joiRequestBody(taskSchemas.updateStatus),
      responses: {
        200: successResponse(
          200,
          "Task status updated successfully",
          { $ref: "#/components/schemas/Task" },
          "Task status updated successfully",
          { ...taskExample, status: "done" },
        ),
        400: errorResponse(
          "Validation failure or invalid status transition",
          400,
          "Bad Request",
          "Cannot mark a pending task as done",
        ),
        401: commonResponses.Unauthorized,
        403: errorResponse(
          "User is not the assignee and not an admin",
          403,
          "Forbidden",
          "You are not authorized to update the status of this task",
        ),
        404: errorResponse(
          "Task not found",
          404,
          "Not Found",
          "Task not found",
        ),
        500: commonResponses.InternalServerError,
      },
    },
  },

  "/tasks/list": {
    get: {
      tags: ["Tasks"],
      summary: "List all tasks",
      description:
        "Paginated list of active tasks with optional filters for priority, status, assignee, and search.",
      operationId: "listTasks",
      security: bearerSecurity,
      parameters: joiToQueryParameters(taskSchemas.listAllTasks),
      responses: {
        200: successResponse(
          200,
          "Tasks fetched successfully",
          { $ref: "#/components/schemas/PaginatedTasks" },
          "Tasks fetched successfully",
          {
            totalItems: 30,
            totalPages: 3,
            currentPage: 1,
            rows: [taskExample],
          },
        ),
        400: commonResponses.BadRequest,
        401: commonResponses.Unauthorized,
        500: commonResponses.InternalServerError,
      },
    },
  },

  "/tasks/details/{id}": {
    get: {
      tags: ["Tasks"],
      summary: "Get task details",
      description:
        "Retrieve a single task by ID, including creator, project, and assignee.",
      operationId: "getTaskDetails",
      security: bearerSecurity,
      parameters: joiToPathParameters(taskSchemas.details),
      responses: {
        200: successResponse(
          200,
          "Task details fetched successfully",
          { $ref: "#/components/schemas/Task" },
          "Task details fetched successfully",
          taskExample,
        ),
        400: commonResponses.BadRequest,
        401: commonResponses.Unauthorized,
        404: errorResponse(
          "Task not found or deleted",
          404,
          "Not Found",
          "Task not found",
        ),
        500: commonResponses.InternalServerError,
      },
    },
  },

  "/tasks/delete/{id}": {
    delete: {
      tags: ["Tasks"],
      summary: "Delete a task",
      description: "Soft-delete a task. **Requires admin role.**",
      operationId: "deleteTask",
      security: adminSecurity,
      parameters: joiToPathParameters(taskSchemas.details),
      responses: {
        200: emptySuccessResponse(
          200,
          "Task deleted successfully",
          "Task deleted successfully",
        ),
        400: errorResponse(
          "Task already deleted",
          400,
          "Bad Request",
          "Task is already deleted",
        ),
        401: commonResponses.Unauthorized,
        403: commonResponses.Forbidden,
        404: errorResponse(
          "Task not found",
          404,
          "Not Found",
          "Task not found",
        ),
        500: commonResponses.InternalServerError,
      },
    },
  },
};
