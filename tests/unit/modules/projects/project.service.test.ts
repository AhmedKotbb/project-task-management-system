import { Project } from "../../../../src/database/models/project.model";
import { Task } from "../../../../src/database/models/task.model";
import { APIError } from "../../../../src/shared/errors";
import ProjectService from "../../../../src/modules/projects/project.service";
import {
  adminPayload,
  createMockProject,
  TEST_PROJECT_ID,
} from "../../../helpers/mocks";

jest.mock("../../../../src/database/models/project.model");
jest.mock("../../../../src/database/models/task.model");
jest.mock("../../../../src/database/models/user.model");

const MockedProject = Project as jest.Mocked<typeof Project>;
const MockedTask = Task as jest.Mocked<typeof Task>;

describe("ProjectService", () => {
  let service: ProjectService;

  beforeEach(() => {
    service = new ProjectService();
  });

  describe("createNewProject", () => {
    const dto = { title: "New Project", description: "Description" };

    it("creates project when title is unique", async () => {
      const project = createMockProject({ title: dto.title });
      MockedProject.findOne.mockResolvedValue(null);
      MockedProject.create.mockResolvedValue(project as never);

      const result = await service.createNewProject(dto, adminPayload);

      expect(result).toBe(project);
      expect(MockedProject.create).toHaveBeenCalledWith({
        title: dto.title,
        description: dto.description,
        createdBy: adminPayload.id,
      });
    });

    it("throws when title already exists", async () => {
      MockedProject.findOne.mockResolvedValue(createMockProject() as never);

      await expect(service.createNewProject(dto, adminPayload)).rejects.toThrow(
        APIError.BadRequest("Project with this title already exists"),
      );
    });
  });

  describe("listAllProjects", () => {
    it("returns paginated projects", async () => {
      const rows = [createMockProject()];
      MockedProject.findAndCountAll.mockResolvedValue({ count: 1, rows } as never);

      const result = await service.listAllProjects({ page: 1, limit: 10 });

      expect(result.totalItems).toBe(1);
      expect(result.rows).toEqual(rows);
    });
  });

  describe("updateProject", () => {
    it("updates project fields", async () => {
      const project = createMockProject();
      const updated = createMockProject({ title: "Updated" });
      MockedProject.findByPk.mockResolvedValue(project as never);
      MockedProject.findOne.mockResolvedValue(null);
      project.update.mockResolvedValue(updated as never);

      const result = await service.updateProject({
        id: TEST_PROJECT_ID,
        title: "Updated",
      });

      expect(result).toBe(updated);
    });

    it("throws NotFound when project does not exist", async () => {
      MockedProject.findByPk.mockResolvedValue(null);

      await expect(
        service.updateProject({ id: TEST_PROJECT_ID, title: "X" }),
      ).rejects.toThrow(APIError.NotFound("Project not found"));
    });

    it("throws when duplicate title exists", async () => {
      MockedProject.findByPk.mockResolvedValue(createMockProject() as never);
      MockedProject.findOne.mockResolvedValue(createMockProject({ id: "other" }) as never);

      await expect(
        service.updateProject({ id: TEST_PROJECT_ID, title: "Duplicate" }),
      ).rejects.toThrow(APIError.BadRequest("Project with this title already exists"));
    });

    it("throws when marking pending project as completed", async () => {
      MockedProject.findByPk.mockResolvedValue(
        createMockProject({ status: "pending" }) as never,
      );
      MockedProject.findOne.mockResolvedValue(null);

      await expect(
        service.updateProject({ id: TEST_PROJECT_ID, status: "completed" }),
      ).rejects.toThrow(
        APIError.BadRequest("Cannot mark a pending project as completed"),
      );
    });
  });

  describe("deleteProject", () => {
    it("soft deletes project and tasks", async () => {
      const project = createMockProject();
      MockedProject.findByPk.mockResolvedValue(project as never);
      MockedTask.update.mockResolvedValue([1] as never);

      await service.deleteProject(TEST_PROJECT_ID);

      expect(project.update).toHaveBeenCalledWith({ isDeleted: true });
      expect(MockedTask.update).toHaveBeenCalledWith(
        { isDeleted: true },
        { where: { projectId: TEST_PROJECT_ID } },
      );
    });

    it("throws NotFound when project does not exist", async () => {
      MockedProject.findByPk.mockResolvedValue(null);

      await expect(service.deleteProject(TEST_PROJECT_ID)).rejects.toThrow(
        APIError.NotFound("Project not found"),
      );
    });

    it("throws when project is already deleted", async () => {
      MockedProject.findByPk.mockResolvedValue(
        createMockProject({ isDeleted: true }) as never,
      );

      await expect(service.deleteProject(TEST_PROJECT_ID)).rejects.toThrow(
        APIError.BadRequest("Project is already deleted"),
      );
    });
  });

  describe("getProjectDetails", () => {
    it("returns project with relations", async () => {
      const project = createMockProject();
      MockedProject.findByPk.mockResolvedValue(project as never);

      const result = await service.getProjectDetails(TEST_PROJECT_ID);

      expect(result).toBe(project);
    });

    it("throws NotFound when project does not exist", async () => {
      MockedProject.findByPk.mockResolvedValue(null);

      await expect(service.getProjectDetails(TEST_PROJECT_ID)).rejects.toThrow(
        APIError.NotFound("Project not found"),
      );
    });
  });
});
