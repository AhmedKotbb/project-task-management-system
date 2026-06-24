import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { isAdmin } from "../../middleware/is-admin";
import { projectSchemas } from "./project.schemas";
import { validateSchemas } from "../../middleware/validate-schemas";
import asyncHandler from "../../middleware/async-wrapper";
import ProjectController from "./project.controller";

class ProjectRoutes {
  public readonly router: Router = Router();
  private readonly controller: ProjectController = new ProjectController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/create',
      authenticate,
      isAdmin,
      validateSchemas(projectSchemas.createProject),
      asyncHandler(this.controller.createNewProjectHandler)
    )

    this.router.get(
      '/details/:id',
      authenticate,
      validateSchemas(projectSchemas.details, 'params'),
      asyncHandler(this.controller.getProjectDetailsHandler)
    )

    this.router.get(
      '/list',
      authenticate,
      validateSchemas(projectSchemas.listAll, 'query'),
      asyncHandler(this.controller.listAllProjectsHandler)
    )

    this.router.patch(
      '/update',
      authenticate,
      isAdmin,
      validateSchemas(projectSchemas.updateProject),
      asyncHandler(this.controller.updateProjectHandler)
    )

    this.router.delete(
      '/delete/:id',
      authenticate,
      isAdmin,
      validateSchemas(projectSchemas.details, 'params'),
      asyncHandler(this.controller.deleteProjectHandler)
    )
  }
}

export default ProjectRoutes;