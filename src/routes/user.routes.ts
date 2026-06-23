import { Router } from "express";
import UserController from "../controllers/user.controller";
import asyncHandler from "../middlewares/async-wrapper";

class UserRoutes {
  public readonly router: Router = Router();
  private readonly controller: UserController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/',
      asyncHandler(this.controller.createNewUserHandler)
    )
  }
}

export default UserRoutes;