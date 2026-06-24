import { Request, Response, NextFunction } from 'express';
import TaskService from "./task.service";
import { TokenPayload } from '../auth/auth.interfaces';
import { responseHandler } from '../../shared/api-response';

class TaskController {
  private readonly service: TaskService;

  constructor() {
    this.service = new TaskService();
  }

  public createNewTaskHandler = async (req: Request, res: Response, next: NextFunction) => {
    await this.service.createNewTask(req.body, req.user as TokenPayload);
    responseHandler(res, 201, "Task created successfully");
  }

  public updateTaskHandler = async (req: Request, res: Response, next: NextFunction) => {
    const task = await this.service.updateTask(req.body);
    responseHandler(res, 200, "Task updated successfully", task);
  }

  public assignTaskHandler = async (req: Request, res: Response, next: NextFunction) => {
    const task = await this.service.assignTask(req.body);
    responseHandler(res, 200, "Task assigned successfully", task);
  }

  public listAllTasksHandler = async (req: Request, res: Response, next: NextFunction) => {
    const data = await this.service.listAllTasks(req.query);
    responseHandler(res, 200, "Tasks fetched successfully", data);
  }

  public getTaskDetailsHandler = async (req: Request, res: Response, next: NextFunction) => {
    const task = await this.service.getTaskDetails(req.params.id as string);
    responseHandler(res, 200, "Task details fetched successfully", task);
  }

  public deleteTaskHandler = async (req: Request, res: Response, next: NextFunction) => {
    await this.service.deleteTask(req.params.id as string);
    responseHandler(res, 200, "Task deleted successfully");
  }

  public updateStatusHandler = async (req: Request, res: Response, next: NextFunction) => {
    const task = await this.service.updateStatus(req.body, req.user as TokenPayload);
    responseHandler(res, 200, "Task status updated successfully", task);
  }
}

export default TaskController;