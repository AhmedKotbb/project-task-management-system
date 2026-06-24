import { Op, WhereOptions } from "sequelize";
import { Task } from "../../database/models/task.model";
import { APIError } from "../../shared/errors";
import { TokenPayload } from "../auth/auth.interfaces";
import { User } from "../../database/models/user.model";
import { Project } from "../../database/models/project.model";
import { AssignTaskDTO, CreateTaskDTO, UpdateStatusDTO, UpdateTaskDTO } from "./task.dtos";

class TaskService {
  public async createNewTask(dto: CreateTaskDTO, payload: TokenPayload) {
    const {
      projectId,
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
    } = dto;
    const existingTask = await Task.findOne({
      where: {
        projectId,
        title,
      },
    });
    if (existingTask) {
      throw APIError.BadRequest(
        "Task with this title already exists in this project",
      );
    }
    const task = await Task.create({
      projectId,
      createdBy: payload.id,
      title,
      description,
      dueDate: new Date(dueDate),
      ...(priority && { priority }),
      ...(status && { status }),
      ...(assignedTo && { assignedTo }),
    });
    return;
  }

  public async updateTask(dto: UpdateTaskDTO) {
    const { id, title, description, status, priority, dueDate } = dto;

    const [task, existingTitle] = await Promise.all([
      Task.findByPk(id),
      title ? Task.findOne({
        where: {
          title,
          id: { [Op.ne]: id },
        },
      }) : null,
    ]);

    if (!task) {
      throw APIError.NotFound("Task not found");
    }

    if (
      title &&
      existingTitle &&
      existingTitle.dataValues.projectId === task.dataValues.projectId
    ) {
      throw APIError.BadRequest(
        "Task with this title already exists in this project",
      );
    }

    if (status && status === "done" && task.dataValues.status === "pending") {
      throw APIError.BadRequest("Cannot mark a pending task as done");
    }

    const updates: any = {
      ...(title && { title }),
      ...(description && { description }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(dueDate && { dueDate: new Date(dueDate) }),
    };

    return await task.update(updates);
  }

  public async assignTask(dto: AssignTaskDTO) {
    const { id, assignedTo } = dto;

    const [task, user] = await Promise.all([
      Task.findByPk(id),
      User.findByPk(assignedTo),
    ]);

    if (!task) {
      throw APIError.NotFound("Task not found");
    }

    if (!user) {
      throw APIError.NotFound("User not found");
    }

    if (user.dataValues.isDeleted) {
      throw APIError.BadRequest("You cannot assign a task to a deleted user");
    }

    return await task.update({ assignedTo });
  }

  public async listAllTasks(query: any) {
    const {
      page,
      limit = 10,
      sortBy = "createdAt",
      sort = "desc",
      search,
      priority,
      status,
      assignedTo,
    } = query;
    const offset = (+page - 1) * limit;

    const where: WhereOptions = {
      isDeleted: false,
      ...(priority && { priority }),
      ...(status && { status }),
      ...(assignedTo && { assignedTo }),
      ...(search && {
        [Op.or]: [{ title: { [Op.iLike]: `%${search}%` } }],
      }),
    };

    const { count, rows } = await Task.findAndCountAll({
      where,
      attributes: { exclude: ["createdBy"] },
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "fullName", "email", "phoneNumber"],
        },
        {
          model: Project,
          as: "project",
          attributes: ["id", "title", "status", "description"],
        },
        {
          model: User,
          as: "assignee",
          attributes: ["id", "fullName", "email", "phoneNumber"],
        }
      ],
      order: [[sortBy, sort]],
      limit,
      offset,
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: +page,
      rows: rows,
    };
  }

  public async getTaskDetails(id: string) {
    const task = await Task.findByPk(id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "fullName", "email", "phoneNumber"],
        },
        {
          model: Project,
          as: "project",
          attributes: ["id", "title", "status", "description"],
        },
        {
          model: User,
          as: "assignee",
          attributes: ["id", "fullName", "email", "phoneNumber"],
        }
      ],
    });
    if (!task || task.dataValues.isDeleted) {
      throw APIError.NotFound("Task not found");
    }
    return task;
  }

  public async deleteTask(id: string) {
    const task = await Task.findByPk(id);
    if (!task) {
      throw APIError.NotFound("Task not found");
    }

    if (task.dataValues.isDeleted) {
      throw APIError.BadRequest("Task is already deleted");
    }

    await task.update({ isDeleted: true });
  }

  public async updateStatus(dto: UpdateStatusDTO, payload: TokenPayload) {
    const { id, status } = dto;
    const task = await Task.findByPk(id);
    if (!task) {
      throw APIError.NotFound("Task not found");
    }

    if(task.dataValues.assignedTo !== payload.id && payload.role !== "admin") {
      throw APIError.Forbidden("You are not authorized to update the status of this task");
    }

    if (status === "done" && task.dataValues.status === "pending") {
      throw APIError.BadRequest("Cannot mark a pending task as done");
    }

    return await task.update({ status });
  }
}

export default TaskService;
