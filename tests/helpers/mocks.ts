import { TokenPayload } from "../../src/modules/auth/auth.interfaces";

export const TEST_USER_ID = "11111111-1111-1111-1111-111111111111";
export const TEST_USER_ID_2 = "22222222-2222-2222-2222-222222222222";
export const TEST_PROJECT_ID = "33333333-3333-3333-3333-333333333333";
export const TEST_TASK_ID = "44444444-4444-4444-4444-444444444444";

export const adminPayload: TokenPayload = {
  id: TEST_USER_ID,
  role: "admin",
  email: "admin@example.com",
};

export const memberPayload: TokenPayload = {
  id: TEST_USER_ID_2,
  role: "member",
  email: "member@example.com",
};

export function createMockSequelizeInstance<T extends Record<string, unknown>>(
  dataValues: T,
  updateImpl: jest.Mock = jest.fn().mockResolvedValue(undefined),
) {
  return {
    dataValues,
    update: updateImpl,
  };
}

export function createMockUser(
  overrides: Partial<{
    id: string;
    email: string;
    password: string;
    role: "admin" | "member";
    isDeleted: boolean;
    refreshToken: string | null;
    fullName: string;
    phoneNumber: string;
    isFirstLogin: boolean;
  }> = {},
) {
  return createMockSequelizeInstance({
    id: TEST_USER_ID,
    fullName: "Test User",
    email: "test@example.com",
    password: "hashed-password",
    phoneNumber: "1234567890",
    role: "admin" as const,
    isDeleted: false,
    refreshToken: "hashed-refresh-token",
    isFirstLogin: true,
    ...overrides,
  });
}

export function createMockProject(
  overrides: Partial<{
    id: string;
    title: string;
    description: string;
    status: string;
    createdBy: string;
    isDeleted: boolean;
  }> = {},
) {
  return createMockSequelizeInstance({
    id: TEST_PROJECT_ID,
    title: "Test Project",
    description: "Test description",
    status: "pending",
    createdBy: TEST_USER_ID,
    isDeleted: false,
    ...overrides,
  });
}

export function createMockTask(
  overrides: Partial<{
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    projectId: string;
    createdBy: string;
    assignedTo: string | null;
    isDeleted: boolean;
    dueDate: Date;
  }> = {},
) {
  return createMockSequelizeInstance({
    id: TEST_TASK_ID,
    title: "Test Task",
    description: "Task description",
    status: "in_progress",
    priority: "medium",
    projectId: TEST_PROJECT_ID,
    createdBy: TEST_USER_ID,
    assignedTo: TEST_USER_ID_2,
    isDeleted: false,
    dueDate: new Date("2026-12-31"),
    ...overrides,
  });
}
