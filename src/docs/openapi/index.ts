import { schemas } from "./components/schemas";
import { securitySchemes } from "./components/security";
import { authPaths } from "./paths/auth.paths";
import { projectPaths } from "./paths/projects.paths";
import { taskPaths } from "./paths/tasks.paths";
import { userPaths } from "./paths/users.paths";

export function buildOpenApiSpec() {
  return {
    openapi: "3.0.3",
    info: {
      title: "Project Task Management System API",
      version: "1.0.0",
      description:
        "REST API for managing users, projects, and tasks. " +
        "Authenticate via `/auth/login`, then use the returned access token as a Bearer token. " +
        "Refresh tokens are managed via httpOnly cookies.",
    },
    servers: [
      {
        url: "/api",
        description: "Current host",
      },
    ],
    tags: [
      {
        name: "Auth",
        description: "Authentication and token management",
      },
      {
        name: "Users",
        description: "User management",
      },
      {
        name: "Projects",
        description: "Project management",
      },
      {
        name: "Tasks",
        description: "Task management and assignment",
      },
    ],
    paths: {
      ...authPaths,
      ...userPaths,
      ...projectPaths,
      ...taskPaths,
    },
    components: {
      securitySchemes,
      schemas,
    },
  };
}

export type OpenApiSpec = ReturnType<typeof buildOpenApiSpec>;
