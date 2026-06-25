import { authSchemas } from "../../../modules/auth/auth.schemas";
import { commonResponses } from "../components/responses";
import {
  emptySuccessResponse,
  errorResponse,
  joiRequestBody,
  successResponse,
} from "../helpers";

export const authPaths = {
  "/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login",
      description:
        "Authenticate with email and password. Returns access and refresh tokens. The refresh token is also set as an httpOnly cookie.",
      operationId: "login",
      requestBody: joiRequestBody(
        authSchemas.login,
        "User credentials",
      ),
      responses: {
        200: successResponse(
          200,
          "Login successful",
          { $ref: "#/components/schemas/TokenPair" },
          "Login successful",
          {
            accessToken:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE3MTkzMDAwMDAsImV4cCI6MTcxOTMwMzYwMH0.example",
            refreshToken:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE3MTkzMDAwMDAsImV4cCI6MTcxOTkwNDgwMH0.example",
          },
        ),
        400: errorResponse(
          "Invalid credentials or validation failure",
          400,
          "Bad Request",
          "Invalid email or password",
        ),
        500: commonResponses.InternalServerError,
      },
    },
  },

  "/auth/refresh-token": {
    post: {
      tags: ["Auth"],
      summary: "Refresh access token",
      description:
        "Exchange a valid refresh token (httpOnly cookie) for a new access/refresh token pair.",
      operationId: "refreshToken",
      security: [{ refreshCookie: [] }],
      responses: {
        200: successResponse(
          200,
          "Tokens refreshed successfully",
          { $ref: "#/components/schemas/TokenPair" },
          "Refresh token successful",
          {
            accessToken:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE3MTkzMDM2MDAsImV4cCI6MTcxOTMwNzIwMH0.example",
            refreshToken:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE3MTkzMDM2MDAsImV4cCI6MTcxOTkwODQwMH0.example",
          },
        ),
        401: errorResponse(
          "Missing or invalid refresh token cookie",
          401,
          "Unauthorized",
          "Invalid or expired refresh token",
        ),
        400: errorResponse(
          "User associated with the refresh token no longer exists",
          400,
          "Bad Request",
          "Invalid user",
        ),
        500: commonResponses.InternalServerError,
      },
    },
  },

  "/auth/logout": {
    post: {
      tags: ["Auth"],
      summary: "Logout",
      description:
        "Invalidate the current refresh token and clear the refresh token cookie.",
      operationId: "logout",
      security: [{ bearerAuth: [] }],
      responses: {
        200: emptySuccessResponse(200, "Logout successful", "Logout successful"),
        401: commonResponses.Unauthorized,
        400: errorResponse(
          "User associated with the token no longer exists",
          400,
          "Bad Request",
          "Invalid user",
        ),
        500: commonResponses.InternalServerError,
      },
    },
  },
};
