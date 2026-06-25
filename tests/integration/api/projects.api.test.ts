import { Project } from "../../../src/database/models/project.model";
import { Task } from "../../../src/database/models/task.model";

jest.mock("../../../src/database/models/project.model");
jest.mock("../../../src/database/models/task.model");
jest.mock("../../../src/database/models/user.model");

import request from "supertest";
import { app } from "../../../src/app";
import { authHeader, adminPayload, memberPayload } from "../helpers/auth";
import { createMockProject, TEST_PROJECT_ID } from "../../helpers/mocks";

const MockedProject = Project as jest.Mocked<typeof Project>;
const MockedTask = Task as jest.Mocked<typeof Task>;

describe("Projects API", () => {
  describe("POST /api/projects/create", () => {
    const body = { title: "New Project", description: "Description" };

    it("returns 201 when admin creates project", async () => {
      MockedProject.findOne.mockResolvedValue(null);
      MockedProject.create.mockResolvedValue(createMockProject(body) as never);

      const response = await request(app)
        .post("/api/projects/create")
        .set(authHeader(adminPayload))
        .send(body);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Project created successfully");
    });

    it("returns 403 when member tries to create project", async () => {
      const response = await request(app)
        .post("/api/projects/create")
        .set(authHeader(memberPayload))
        .send(body);

      expect(response.status).toBe(403);
    });

    it("returns 400 when title already exists", async () => {
      MockedProject.findOne.mockResolvedValue(createMockProject() as never);

      const response = await request(app)
        .post("/api/projects/create")
        .set(authHeader())
        .send(body);

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/projects/details/:id", () => {
    it("returns 200 with project details", async () => {
      MockedProject.findByPk.mockResolvedValue(createMockProject() as never);

      const response = await request(app)
        .get(`/api/projects/details/${TEST_PROJECT_ID}`)
        .set(authHeader());

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Project details fetched successfully");
    });

    it("returns 404 when project not found", async () => {
      MockedProject.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .get(`/api/projects/details/${TEST_PROJECT_ID}`)
        .set(authHeader());

      expect(response.status).toBe(404);
    });
  });

  describe("GET /api/projects/list", () => {
    it("returns 200 with paginated projects", async () => {
      MockedProject.findAndCountAll.mockResolvedValue({
        count: 1,
        rows: [createMockProject()],
      } as never);

      const response = await request(app)
        .get("/api/projects/list")
        .query({ page: 1 })
        .set(authHeader());

      expect(response.status).toBe(200);
      expect(response.body.data.totalItems).toBe(1);
    });
  });

  describe("PATCH /api/projects/update", () => {
    it("returns 200 when admin updates project", async () => {
      const project = createMockProject();
      const updated = createMockProject({ title: "Updated" });
      MockedProject.findByPk.mockResolvedValue(project as never);
      MockedProject.findOne.mockResolvedValue(null);
      project.update.mockResolvedValue(updated as never);

      const response = await request(app)
        .patch("/api/projects/update")
        .set(authHeader())
        .send({ id: TEST_PROJECT_ID, title: "Updated" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Project updated successfully");
    });

    it("returns 403 when member tries to update", async () => {
      const response = await request(app)
        .patch("/api/projects/update")
        .set(authHeader(memberPayload))
        .send({ id: TEST_PROJECT_ID, title: "Updated" });

      expect(response.status).toBe(403);
    });
  });

  describe("DELETE /api/projects/delete/:id", () => {
    it("returns 200 when admin deletes project", async () => {
      const project = createMockProject();
      MockedProject.findByPk.mockResolvedValue(project as never);
      MockedTask.update.mockResolvedValue([1] as never);

      const response = await request(app)
        .delete(`/api/projects/delete/${TEST_PROJECT_ID}`)
        .set(authHeader());

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Project deleted successfully");
    });

    it("returns 403 when member tries to delete", async () => {
      const response = await request(app)
        .delete(`/api/projects/delete/${TEST_PROJECT_ID}`)
        .set(authHeader(memberPayload));

      expect(response.status).toBe(403);
    });
  });
});
