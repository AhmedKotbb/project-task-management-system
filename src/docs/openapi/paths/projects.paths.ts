import { projectSchemas } from "../../../modules/projects/project.schemas";
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

const projectTaskExample = {
  id: "550e8400-e29b-41d4-a716-446655440020",
  title: "Design homepage mockup",
  description: "Create wireframes and mockups for the homepage",
  status: "in_progress",
  assignedTo: "550e8400-e29b-41d4-a716-446655440002",
  assignee: {
    id: "550e8400-e29b-41d4-a716-446655440002",
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    phoneNumber: "0987654321",
  },
  createdAt: "2026-06-01T08:00:00.000Z",
  updatedAt: "2026-06-25T10:30:45.000Z",
};

export const projectPaths = {
  "/projects/create": {
    post: {
      tags: ["Projects"],
      summary: "Create a new project",
      description: "Create a project. **Requires admin role.**",
      operationId: "createProject",
      security: adminSecurity,
      requestBody: joiRequestBody(projectSchemas.createProject),
      responses: {
        201: emptySuccessResponse(
          201,
          "Project created successfully",
          "Project created successfully",
        ),
        400: errorResponse(
          "Validation failure or duplicate title",
          400,
          "Bad Request",
          "Project with this title already exists",
        ),
        401: commonResponses.Unauthorized,
        403: commonResponses.Forbidden,
        500: commonResponses.InternalServerError,
      },
    },
  },

  "/projects/details/{id}": {
    get: {
      tags: ["Projects"],
      summary: "Get project details",
      description:
        "Retrieve a single project by ID, including creator information and associated tasks with assignees.",
      operationId: "getProjectDetails",
      security: bearerSecurity,
      parameters: joiToPathParameters(projectSchemas.details),
      responses: {
        200: successResponse(
          200,
          "Project details fetched successfully",
          { $ref: "#/components/schemas/Project" },
          "Project details fetched successfully",
          {
            id: "550e8400-e29b-41d4-a716-446655440010",
            title: "Website Redesign",
            description: "Redesign the company website with a modern UI",
            status: "pending",
            isDeleted: false,
            createdBy: "550e8400-e29b-41d4-a716-446655440001",
            creator: {
              id: "550e8400-e29b-41d4-a716-446655440001",
              fullName: "Admin User",
              email: "admin@example.com",
              phoneNumber: "1234567890",
            },
            tasks: [projectTaskExample],
            createdAt: "2026-06-01T08:00:00.000Z",
            updatedAt: "2026-06-25T10:30:45.000Z",
          },
        ),
        400: commonResponses.BadRequest,
        401: commonResponses.Unauthorized,
        404: errorResponse(
          "Project not found",
          404,
          "Not Found",
          "Project not found",
        ),
        500: commonResponses.InternalServerError,
      },
    },
  },

  "/projects/list": {
    get: {
      tags: ["Projects"],
      summary: "List all projects",
      description:
        "Paginated list of active projects with optional title search. Each project includes its tasks and assignees.",
      operationId: "listProjects",
      security: bearerSecurity,
      parameters: joiToQueryParameters(projectSchemas.listAll),
      responses: {
        200: successResponse(
          200,
          "Projects fetched successfully",
          { $ref: "#/components/schemas/PaginatedProjects" },
          "Projects fetched successfully",
          {
            totalItems: 15,
            totalPages: 2,
            currentPage: 1,
            rows: [
              {
                id: "550e8400-e29b-41d4-a716-446655440010",
                title: "Website Redesign",
                description: "Redesign the company website with a modern UI",
                status: "pending",
                isDeleted: false,
                creator: {
                  id: "550e8400-e29b-41d4-a716-446655440001",
                  fullName: "Admin User",
                  email: "admin@example.com",
                  phoneNumber: "1234567890",
                },
                tasks: [projectTaskExample],
                createdAt: "2026-06-01T08:00:00.000Z",
                updatedAt: "2026-06-25T10:30:45.000Z",
              },
            ],
          },
        ),
        400: commonResponses.BadRequest,
        401: commonResponses.Unauthorized,
        500: commonResponses.InternalServerError,
      },
    },
  },

  "/projects/update": {
    patch: {
      tags: ["Projects"],
      summary: "Update a project",
      description: "Update project fields. **Requires admin role.**",
      operationId: "updateProject",
      security: adminSecurity,
      requestBody: joiRequestBody(projectSchemas.updateProject),
      responses: {
        200: successResponse(
          200,
          "Project updated successfully",
          { $ref: "#/components/schemas/Project" },
          "Project updated successfully",
          {
            id: "550e8400-e29b-41d4-a716-446655440010",
            title: "Website Redesign v2",
            description: "Updated project description",
            status: "in_progress",
            isDeleted: false,
            createdBy: "550e8400-e29b-41d4-a716-446655440001",
            createdAt: "2026-06-01T08:00:00.000Z",
            updatedAt: "2026-06-25T11:00:00.000Z",
          },
        ),
        400: errorResponse(
          "Validation failure, duplicate title, or invalid status transition",
          400,
          "Bad Request",
          "Cannot mark a pending project as completed",
        ),
        401: commonResponses.Unauthorized,
        403: commonResponses.Forbidden,
        404: errorResponse(
          "Project not found",
          404,
          "Not Found",
          "Project not found",
        ),
        500: commonResponses.InternalServerError,
      },
    },
  },

  "/projects/delete/{id}": {
    delete: {
      tags: ["Projects"],
      summary: "Delete a project",
      description: "Soft-delete a project (and all associated tasks). **Requires admin role.**",
      operationId: "deleteProject",
      security: adminSecurity,
      parameters: joiToPathParameters(projectSchemas.details),
      responses: {
        200: emptySuccessResponse(
          200,
          "Project deleted successfully",
          "Project deleted successfully",
        ),
        400: errorResponse(
          "Project already deleted",
          400,
          "Bad Request",
          "Project is already deleted",
        ),
        401: commonResponses.Unauthorized,
        403: commonResponses.Forbidden,
        404: errorResponse(
          "Project not found",
          404,
          "Not Found",
          "Project not found",
        ),
        500: commonResponses.InternalServerError,
      },
    },
  },
};
