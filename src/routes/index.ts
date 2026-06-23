import { Router } from "express";
import AuthRoutes from "./auth.routes";
import ProjectRoutes from "./project.routes";
import TaskRoutes from "./task.routes";
import UserRoutes from "./user.routes";

class Routes {
  public readonly router: Router = Router();
  private readonly authRoutes: AuthRoutes = new AuthRoutes();
  private readonly userRoutes: UserRoutes = new UserRoutes();
  private readonly projectRoutes: ProjectRoutes = new ProjectRoutes();
  private readonly taskRoutes: TaskRoutes = new TaskRoutes();


  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use("/auth", this.authRoutes.router);
    this.router.use("/users", this.userRoutes.router);
    this.router.use("/projects", this.projectRoutes.router);
    this.router.use("/tasks", this.taskRoutes.router);
  }

}

export default Routes;