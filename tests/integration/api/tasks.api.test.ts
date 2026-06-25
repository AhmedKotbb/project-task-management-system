import { Task } from "../../../src/database/models/task.model";
import { User } from "../../../src/database/models/user.model";

jest.mock("../../../src/database/models/task.model");
jest.mock("../../../src/database/models/user.model");
jest.mock("../../../src/database/models/project.model");

import request from "supertest";
import { app } from "../../../src/app";
import { authHeader, adminPayload, memberPayload } from "../helpers/auth";
import {
  createMockTask,
  createMockUser,
  TEST_PROJECT_ID,
  TEST_TASK_ID,
  TEST_USER_ID_2,
} from "../../helpers/mocks";

const MockedTask = Task as jest.Mocked<typeof Task>;
const MockedUser = User as jest.Mocked<typeof User>;

describe("Tasks API", () => {
  describe("POST /api/tasks/create", () => {
    const body = {
      projectId: TEST_PROJECT_ID,
      title: "New Task",
      description: "Description",
      dueDate: "2026-12-31",
      priority: "high",
    };

    it("returns 201 when admin creates task", async () => {
      MockedTask.findOne.mockResolvedValue(null);
      MockedTask.create.mockResolvedValue(createMockTask() as never);

      const response = await request(app)
        .post("/api/tasks/create")
        .set(authHeader(adminPayload))
        .send(body);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Task created successfully");
    });

    it("returns 403 when member tries to create task", async () => {
      const response = await request(app)
        .post("/api/tasks/create")
        .set(authHeader(memberPayload))
        .send(body);

      expect(response.status).toBe(403);
    });
  });

  describe("PATCH /api/tasks/update", () => {
    it("returns 200 when admin updates task", async () => {
      const task = createMockTask();
      const updated = createMockTask({ title: "Updated" });
      MockedTask.findByPk.mockResolvedValue(task as never);
      MockedTask.findOne.mockResolvedValue(null);
      task.update.mockResolvedValue(updated as never);

      const response = await request(app)
        .patch("/api/tasks/update")
        .set(authHeader())
        .send({ id: TEST_TASK_ID, title: "Updated" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Task updated successfully");
    });

    it("returns 403 when member tries to update", async () => {
      const response = await request(app)
        .patch("/api/tasks/update")
        .set(authHeader(memberPayload))
        .send({ id: TEST_TASK_ID, title: "Updated" });

      expect(response.status).toBe(403);
    });
  });

  describe("PATCH /api/tasks/assign", () => {
    it("returns 200 when admin assigns task", async () => {
      const task = createMockTask();
      MockedTask.findByPk.mockResolvedValue(task as never);
      MockedUser.findByPk.mockResolvedValue(createMockUser({ id: TEST_USER_ID_2 }) as never);
      task.update.mockResolvedValue(task as never);

      const response = await request(app)
        .patch("/api/tasks/assign")
        .set(authHeader())
        .send({ id: TEST_TASK_ID, assignedTo: TEST_USER_ID_2 });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Task assigned successfully");
    });
  });

  describe("PATCH /api/tasks/update-status", () => {
    it("returns 200 when assignee updates status", async () => {
      const task = createMockTask({
        assignedTo: memberPayload.id,
        status: "in_progress",
      });
      MockedTask.findByPk.mockResolvedValue(task as never);
      task.update.mockResolvedValue(task as never);

      const response = await request(app)
        .patch("/api/tasks/update-status")
        .set(authHeader(memberPayload))
        .send({ id: TEST_TASK_ID, status: "done" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Task status updated successfully");
    });

    it("returns 403 when unauthorized user updates status", async () => {
      MockedTask.findByPk.mockResolvedValue(
        createMockTask({ assignedTo: TEST_USER_ID_2 }) as never,
      );

      const response = await request(app)
        .patch("/api/tasks/update-status")
        .set(authHeader({ ...memberPayload, id: "00000000-0000-0000-0000-000000000099" }))
        .send({ id: TEST_TASK_ID, status: "done" });

      expect(response.status).toBe(403);
    });
  });

  describe("GET /api/tasks/list", () => {
    it("returns 200 with paginated tasks", async () => {
      MockedTask.findAndCountAll.mockResolvedValue({
        count: 1,
        rows: [createMockTask()],
      } as never);

      const response = await request(app)
        .get("/api/tasks/list")
        .query({ page: 1 })
        .set(authHeader());

      expect(response.status).toBe(200);
      expect(response.body.data.totalItems).toBe(1);
    });
  });

  describe("GET /api/tasks/details/:id", () => {
    it("returns 200 with task details", async () => {
      MockedTask.findByPk.mockResolvedValue(createMockTask() as never);

      const response = await request(app)
        .get(`/api/tasks/details/${TEST_TASK_ID}`)
        .set(authHeader());

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Task details fetched successfully");
    });

    it("returns 404 when task not found", async () => {
      MockedTask.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .get(`/api/tasks/details/${TEST_TASK_ID}`)
        .set(authHeader());

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/tasks/delete/:id", () => {
    it("returns 200 when admin deletes task", async () => {
      const task = createMockTask();
      MockedTask.findByPk.mockResolvedValue(task as never);

      const response = await request(app)
        .delete(`/api/tasks/delete/${TEST_TASK_ID}`)
        .set(authHeader());

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Task deleted successfully");
    });

    it("returns 403 when member tries to delete", async () => {
      const response = await request(app)
        .delete(`/api/tasks/delete/${TEST_TASK_ID}`)
        .set(authHeader(memberPayload));

      expect(response.status).toBe(403);
    });
  });
});
