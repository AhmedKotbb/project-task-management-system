export const schemas = {
  ErrorResponse: {
    type: "object",
    required: ["statusCode", "statusText", "message"],
    properties: {
      statusCode: { type: "integer", example: 400 },
      statusText: { type: "string", example: "Bad Request" },
      message: { type: "string", example: "Validation error message" },
    },
  },

  ApiSuccessResponse: {
    type: "object",
    required: ["statusCode", "message", "data", "timestamp"],
    properties: {
      statusCode: { type: "integer", example: 200 },
      message: { type: "string", example: "Operation successful" },
      data: { type: "object" },
      timestamp: { type: "string", example: "2026-6-25 10:30:45" },
    },
  },

  TokenPair: {
    type: "object",
    required: ["accessToken", "refreshToken"],
    properties: {
      accessToken: {
        type: "string",
        description: "JWT access token for Bearer authentication",
        example:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE3MTkzMDAwMDAsImV4cCI6MTcxOTMwMzYwMH0.example",
      },
      refreshToken: {
        type: "string",
        description: "JWT refresh token (also set as httpOnly cookie)",
        example:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE3MTkzMDAwMDAsImV4cCI6MTcxOTkwNDgwMH0.example",
      },
    },
  },

  UserRole: {
    type: "string",
    enum: ["admin", "member"],
    example: "member",
  },

  User: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "550e8400-e29b-41d4-a716-446655440001",
      },
      fullName: { type: "string", example: "John Doe" },
      email: { type: "string", format: "email", example: "john.doe@example.com" },
      phoneNumber: { type: "string", example: "1234567890" },
      role: { $ref: "#/components/schemas/UserRole" },
      isDeleted: { type: "boolean", example: false },
      isFirstLogin: { type: "boolean", example: true },
      lastLoginAt: {
        type: "string",
        format: "date-time",
        nullable: true,
        example: "2026-06-25T10:30:45.000Z",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        example: "2026-06-01T08:00:00.000Z",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        example: "2026-06-25T10:30:45.000Z",
      },
    },
  },

  UserSummary: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "550e8400-e29b-41d4-a716-446655440001",
      },
      fullName: { type: "string", example: "John Doe" },
      email: { type: "string", format: "email", example: "john.doe@example.com" },
      phoneNumber: { type: "string", example: "1234567890" },
    },
  },

  ProjectStatus: {
    type: "string",
    enum: ["pending", "in_progress", "completed"],
    example: "pending",
  },

  Project: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "550e8400-e29b-41d4-a716-446655440010",
      },
      title: { type: "string", example: "Website Redesign" },
      description: {
        type: "string",
        example: "Redesign the company website with a modern UI",
      },
      status: { $ref: "#/components/schemas/ProjectStatus" },
      isDeleted: { type: "boolean", example: false },
      createdBy: {
        type: "string",
        format: "uuid",
        example: "550e8400-e29b-41d4-a716-446655440001",
      },
      creator: { $ref: "#/components/schemas/UserSummary" },
      createdAt: {
        type: "string",
        format: "date-time",
        example: "2026-06-01T08:00:00.000Z",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        example: "2026-06-25T10:30:45.000Z",
      },
    },
  },

  TaskStatus: {
    type: "string",
    enum: ["pending", "in_progress", "done"],
    example: "pending",
  },

  TaskPriority: {
    type: "string",
    enum: ["low", "medium", "high"],
    example: "medium",
  },

  ProjectSummary: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "550e8400-e29b-41d4-a716-446655440010",
      },
      title: { type: "string", example: "Website Redesign" },
      status: { $ref: "#/components/schemas/ProjectStatus" },
      description: {
        type: "string",
        example: "Redesign the company website with a modern UI",
      },
    },
  },

  Task: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "550e8400-e29b-41d4-a716-446655440020",
      },
      projectId: {
        type: "string",
        format: "uuid",
        example: "550e8400-e29b-41d4-a716-446655440010",
      },
      title: { type: "string", example: "Design homepage mockup" },
      description: {
        type: "string",
        example: "Create wireframes and mockups for the homepage",
      },
      status: { $ref: "#/components/schemas/TaskStatus" },
      priority: { $ref: "#/components/schemas/TaskPriority" },
      dueDate: {
        type: "string",
        format: "date-time",
        example: "2026-07-01T00:00:00.000Z",
      },
      assignedTo: {
        type: "string",
        format: "uuid",
        nullable: true,
        example: "550e8400-e29b-41d4-a716-446655440002",
      },
      isDeleted: { type: "boolean", example: false },
      creator: { $ref: "#/components/schemas/UserSummary" },
      project: { $ref: "#/components/schemas/ProjectSummary" },
      assignee: {
        allOf: [{ $ref: "#/components/schemas/UserSummary" }],
        nullable: true,
      },
      createdAt: {
        type: "string",
        format: "date-time",
        example: "2026-06-01T08:00:00.000Z",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        example: "2026-06-25T10:30:45.000Z",
      },
    },
  },

  PaginatedUsers: {
    type: "object",
    properties: {
      totalItems: { type: "integer", example: 42 },
      totalPages: { type: "integer", example: 5 },
      currentPage: { type: "integer", example: 1 },
      rows: {
        type: "array",
        items: { $ref: "#/components/schemas/User" },
      },
    },
  },

  PaginatedProjects: {
    type: "object",
    properties: {
      totalItems: { type: "integer", example: 15 },
      totalPages: { type: "integer", example: 2 },
      currentPage: { type: "integer", example: 1 },
      rows: {
        type: "array",
        items: { $ref: "#/components/schemas/Project" },
      },
    },
  },

  PaginatedTasks: {
    type: "object",
    properties: {
      totalItems: { type: "integer", example: 30 },
      totalPages: { type: "integer", example: 3 },
      currentPage: { type: "integer", example: 1 },
      rows: {
        type: "array",
        items: { $ref: "#/components/schemas/Task" },
      },
    },
  },
};
