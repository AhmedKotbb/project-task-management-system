import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { isAdmin } from "../../middleware/is-admin";
import asyncHandler from "../../middleware/async-wrapper";
import { validateSchemas } from "../../middleware/validate-schemas";
import TaskController from "./task.controller";
import { taskSchemas } from "./task.schemas";

class TaskRoutes {
  public readonly router: Router = Router();
  private readonly controller: TaskController = new TaskController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      "/create",
      authenticate,
      isAdmin,
      validateSchemas(taskSchemas.createTask),
      asyncHandler(this.controller.createNewTaskHandler)
    )

    this.router.patch(
      "/update",
      authenticate,
      isAdmin,
      validateSchemas(taskSchemas.updateTask),
      asyncHandler(this.controller.updateTaskHandler)
    )

    this.router.patch(
      "/assign",
      authenticate,
      isAdmin,
      validateSchemas(taskSchemas.assignTask),
      asyncHandler(this.controller.assignTaskHandler)
    )

    this.router.patch(
      "/update-status",
      authenticate,
      validateSchemas(taskSchemas.updateStatus),
      asyncHandler(this.controller.updateStatusHandler)
    )

    this.router.get(
      "/list",
      authenticate,
      validateSchemas(taskSchemas.listAllTasks, 'query'),
      asyncHandler(this.controller.listAllTasksHandler)
    )

    this.router.get(
      "/details/:id",
      authenticate,
      validateSchemas(taskSchemas.details, 'params'),
      asyncHandler(this.controller.getTaskDetailsHandler)
    )

    this.router.delete(
      "/delete/:id",
      authenticate,
      isAdmin,
      validateSchemas(taskSchemas.details, 'params'),
      asyncHandler(this.controller.deleteTaskHandler)
    )
  }
}

export default TaskRoutes;