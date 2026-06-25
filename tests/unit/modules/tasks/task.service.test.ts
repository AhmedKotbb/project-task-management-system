import { Task } from "../../../../src/database/models/task.model";
import { User } from "../../../../src/database/models/user.model";
import { APIError } from "../../../../src/shared/errors";
import TaskService from "../../../../src/modules/tasks/task.service";
import {
  adminPayload,
  createMockTask,
  createMockUser,
  memberPayload,
  TEST_PROJECT_ID,
  TEST_TASK_ID,
  TEST_USER_ID_2,
} from "../../../helpers/mocks";

jest.mock("../../../../src/database/models/task.model");
jest.mock("../../../../src/database/models/user.model");
jest.mock("../../../../src/database/models/project.model");

const MockedTask = Task as jest.Mocked<typeof Task>;
const MockedUser = User as jest.Mocked<typeof User>;

describe("TaskService", () => {
  let service: TaskService;

  beforeEach(() => {
    service = new TaskService();
  });

  describe("createNewTask", () => {
    const dto = {
      projectId: TEST_PROJECT_ID,
      title: "New Task",
      description: "Description",
      dueDate: "2026-12-31",
      priority: "high" as const,
    };

    it("creates task when title is unique in project", async () => {
      MockedTask.findOne.mockResolvedValue(null);
      MockedTask.create.mockResolvedValue(createMockTask() as never);

      await service.createNewTask(dto, adminPayload);

      expect(MockedTask.create).toHaveBeenCalledWith(
        expect.objectContaining({
          projectId: dto.projectId,
          title: dto.title,
          createdBy: adminPayload.id,
        }),
      );
    });

    it("throws when duplicate title exists in project", async () => {
      MockedTask.findOne.mockResolvedValue(createMockTask() as never);

      await expect(service.createNewTask(dto, adminPayload)).rejects.toThrow(
        APIError.BadRequest("Task with this title already exists in this project"),
      );
    });
  });

  describe("updateTask", () => {
    it("updates task fields", async () => {
      const task = createMockTask();
      const updated = createMockTask({ title: "Updated" });
      MockedTask.findByPk.mockResolvedValue(task as never);
      MockedTask.findOne.mockResolvedValue(null);
      task.update.mockResolvedValue(updated as never);

      const result = await service.updateTask({
        id: TEST_TASK_ID,
        title: "Updated",
      });

      expect(result).toBe(updated);
    });

    it("throws NotFound when task does not exist", async () => {
      MockedTask.findByPk.mockResolvedValue(null);

      await expect(
        service.updateTask({ id: TEST_TASK_ID, title: "X" }),
      ).rejects.toThrow(APIError.NotFound("Task not found"));
    });

    it("throws when marking pending task as done", async () => {
      MockedTask.findByPk.mockResolvedValue(
        createMockTask({ status: "pending" }) as never,
      );
      MockedTask.findOne.mockResolvedValue(null);

      await expect(
        service.updateTask({ id: TEST_TASK_ID, status: "done" }),
      ).rejects.toThrow(APIError.BadRequest("Cannot mark a pending task as done"));
    });
  });

  describe("assignTask", () => {
    it("assigns task to valid user", async () => {
      const task = createMockTask();
      const user = createMockUser({ id: TEST_USER_ID_2 });
      MockedTask.findByPk.mockResolvedValue(task as never);
      MockedUser.findByPk.mockResolvedValue(user as never);
      task.update.mockResolvedValue(task as never);

      await service.assignTask({ id: TEST_TASK_ID, assignedTo: TEST_USER_ID_2 });

      expect(task.update).toHaveBeenCalledWith({ assignedTo: TEST_USER_ID_2 });
    });

    it("throws when task not found", async () => {
      MockedTask.findByPk.mockResolvedValue(null);
      MockedUser.findByPk.mockResolvedValue(createMockUser() as never);

      await expect(
        service.assignTask({ id: TEST_TASK_ID, assignedTo: TEST_USER_ID_2 }),
      ).rejects.toThrow(APIError.NotFound("Task not found"));
    });

    it("throws when assignee not found", async () => {
      MockedTask.findByPk.mockResolvedValue(createMockTask() as never);
      MockedUser.findByPk.mockResolvedValue(null);

      await expect(
        service.assignTask({ id: TEST_TASK_ID, assignedTo: TEST_USER_ID_2 }),
      ).rejects.toThrow(APIError.NotFound("User not found"));
    });

    it("throws when assignee is deleted", async () => {
      MockedTask.findByPk.mockResolvedValue(createMockTask() as never);
      MockedUser.findByPk.mockResolvedValue(
        createMockUser({ isDeleted: true }) as never,
      );

      await expect(
        service.assignTask({ id: TEST_TASK_ID, assignedTo: TEST_USER_ID_2 }),
      ).rejects.toThrow(
        APIError.BadRequest("You cannot assign a task to a deleted user"),
      );
    });
  });

  describe("listAllTasks", () => {
    it("returns paginated tasks", async () => {
      const rows = [createMockTask()];
      MockedTask.findAndCountAll.mockResolvedValue({ count: 1, rows } as never);

      const result = await service.listAllTasks({ page: 1, limit: 10 });

      expect(result.totalItems).toBe(1);
      expect(result.rows).toEqual(rows);
    });
  });

  describe("getTaskDetails", () => {
    it("returns task when found and not deleted", async () => {
      const task = createMockTask();
      MockedTask.findByPk.mockResolvedValue(task as never);

      const result = await service.getTaskDetails(TEST_TASK_ID);

      expect(result).toBe(task);
    });

    it("throws NotFound when task is deleted", async () => {
      MockedTask.findByPk.mockResolvedValue(
        createMockTask({ isDeleted: true }) as never,
      );

      await expect(service.getTaskDetails(TEST_TASK_ID)).rejects.toThrow(
        APIError.NotFound("Task not found"),
      );
    });
  });

  describe("deleteTask", () => {
    it("soft deletes task", async () => {
      const task = createMockTask();
      MockedTask.findByPk.mockResolvedValue(task as never);

      await service.deleteTask(TEST_TASK_ID);

      expect(task.update).toHaveBeenCalledWith({ isDeleted: true });
    });

    it("throws when task already deleted", async () => {
      MockedTask.findByPk.mockResolvedValue(
        createMockTask({ isDeleted: true }) as never,
      );

      await expect(service.deleteTask(TEST_TASK_ID)).rejects.toThrow(
        APIError.BadRequest("Task is already deleted"),
      );
    });
  });

  describe("updateStatus", () => {
    it("allows assignee to update status", async () => {
      const task = createMockTask({ assignedTo: memberPayload.id, status: "in_progress" });
      MockedTask.findByPk.mockResolvedValue(task as never);
      task.update.mockResolvedValue(task as never);

      await service.updateStatus(
        { id: TEST_TASK_ID, status: "done" },
        memberPayload,
      );

      expect(task.update).toHaveBeenCalledWith({ status: "done" });
    });

    it("forbids non-assignee non-admin", async () => {
      MockedTask.findByPk.mockResolvedValue(
        createMockTask({ assignedTo: TEST_USER_ID_2 }) as never,
      );

      await expect(
        service.updateStatus(
          { id: TEST_TASK_ID, status: "done" },
          { ...memberPayload, id: "other-user-id" },
        ),
      ).rejects.toThrow(
        APIError.Forbidden("You are not authorized to update the status of this task"),
      );
    });

    it("throws when marking pending task as done", async () => {
      MockedTask.findByPk.mockResolvedValue(
        createMockTask({ status: "pending", assignedTo: adminPayload.id }) as never,
      );

      await expect(
        service.updateStatus({ id: TEST_TASK_ID, status: "done" }, adminPayload),
      ).rejects.toThrow(APIError.BadRequest("Cannot mark a pending task as done"));
    });
  });
});
