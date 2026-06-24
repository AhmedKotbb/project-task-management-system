import { Request, Response, NextFunction } from 'express';
import ProjectService from "./project.service";
import { responseHandler } from '../../shared/api-response';
import { TokenPayload } from '../auth/auth.interfaces';

class ProjectController {
  private readonly service: ProjectService;

  constructor() {
    this.service = new ProjectService();
  }

  public createNewProjectHandler = async (req: Request, res: Response, next: NextFunction) => {
    await this.service.createNewProject(req.body, req.user as TokenPayload);
    responseHandler(res, 201, "Project created successfully");
  }

  public getProjectDetailsHandler = async (req: Request, res: Response, next: NextFunction) => {
    const project = await this.service.getProjectDetails(req.params.id as string);
    responseHandler(res, 200, "Project details fetched successfully", project);
  }

  public listAllProjectsHandler = async (req: Request, res: Response, next: NextFunction) => {
    const data = await this.service.listAllProjects(req.query);
    responseHandler(res, 200, "Projects fetched successfully", data);
  }

  public updateProjectHandler = async (req: Request, res: Response, next: NextFunction) => {
    const project = await this.service.updateProject(req.body);
    responseHandler(res, 200, "Project updated successfully", project);
  }

  public deleteProjectHandler = async (req: Request, res: Response, next: NextFunction) => {
    await this.service.deleteProject(req.params.id as string);
    responseHandler(res, 200, "Project deleted successfully");
  }
}

export default ProjectController;