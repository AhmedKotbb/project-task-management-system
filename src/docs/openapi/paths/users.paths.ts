import { userSchemas } from "../../../modules/users/user.schemas";
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

export const userPaths = {
  "/users/create": {
    post: {
      tags: ["Users"],
      summary: "Create a new user",
      description:
        "Create a user account. A random initial password is generated and emailed to the user. **Requires admin role.**",
      operationId: "createUser",
      security: bearerSecurity,
      requestBody: joiRequestBody(userSchemas.createUser),
      responses: {
        201: emptySuccessResponse(
          201,
          "User created successfully",
          "User created successfully",
        ),
        400: errorResponse(
          "Validation failure or duplicate email/phone",
          400,
          "Bad Request",
          "The email/phone number is already associated with an existing user",
        ),
        401: commonResponses.Unauthorized,
        500: commonResponses.InternalServerError,
      },
    },
  },

  "/users/details/{id}": {
    get: {
      tags: ["Users"],
      summary: "Get user details",
      description: "Retrieve a single user by ID. Password and refresh token are excluded.",
      operationId: "getUserDetails",
      security: bearerSecurity,
      parameters: joiToPathParameters(userSchemas.details),
      responses: {
        200: successResponse(
          200,
          "User details fetched successfully",
          { $ref: "#/components/schemas/User" },
          "User details fetched successfully",
          {
            id: "550e8400-e29b-41d4-a716-446655440001",
            fullName: "John Doe",
            email: "john.doe@example.com",
            phoneNumber: "1234567890",
            role: "member",
            isDeleted: false,
            isFirstLogin: true,
            lastLoginAt: "2026-06-25T10:30:45.000Z",
            createdAt: "2026-06-01T08:00:00.000Z",
            updatedAt: "2026-06-25T10:30:45.000Z",
          },
        ),
        400: commonResponses.BadRequest,
        401: commonResponses.Unauthorized,
        404: errorResponse(
          "User not found",
          404,
          "Not Found",
          "User not found",
        ),
        500: commonResponses.InternalServerError,
      },
    },
  },

  "/users/list": {
    get: {
      tags: ["Users"],
      summary: "List all users",
      description: "Paginated list of active (non-deleted) users with optional search.",
      operationId: "listUsers",
      security: bearerSecurity,
      parameters: joiToQueryParameters(userSchemas.listAll),
      responses: {
        200: successResponse(
          200,
          "Users fetched successfully",
          { $ref: "#/components/schemas/PaginatedUsers" },
          "Users fetched successfully",
          {
            totalItems: 42,
            totalPages: 5,
            currentPage: 1,
            rows: [
              {
                id: "550e8400-e29b-41d4-a716-446655440001",
                fullName: "John Doe",
                email: "john.doe@example.com",
                phoneNumber: "1234567890",
                role: "member",
                isDeleted: false,
                isFirstLogin: true,
                lastLoginAt: "2026-06-25T10:30:45.000Z",
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

  "/users/change-password": {
    patch: {
      tags: ["Users"],
      summary: "Change password",
      description:
        "Change the authenticated user's password. New password must meet complexity requirements.",
      operationId: "changePassword",
      security: bearerSecurity,
      requestBody: joiRequestBody(userSchemas.changePassword),
      responses: {
        200: emptySuccessResponse(
          200,
          "Password changed successfully",
          "Password changed successfully",
        ),
        400: errorResponse(
          "Validation failure or password mismatch",
          400,
          "Bad Request",
          "New password and confirm password do not match",
        ),
        401: commonResponses.Unauthorized,
        404: errorResponse(
          "Authenticated user not found",
          404,
          "Not Found",
          "User not found",
        ),
        500: commonResponses.InternalServerError,
      },
    },
  },
};
