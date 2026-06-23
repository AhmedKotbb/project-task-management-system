import { Router } from "express";
import UserController from "../controllers/user.controller";
import asyncHandler from "../middlewares/async-wrapper";
import { validateSchemas } from "../middlewares/validate-schemas";
import { userSchemas } from "../schemas/user.schemas";

class UserRoutes {
  public readonly router: Router = Router();
  private readonly controller: UserController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/',
      validateSchemas(userSchemas.createUser),
      asyncHandler(this.controller.createNewUserHandler)
    )

    this.router.get('/details/:id',
      validateSchemas(userSchemas.details, 'params'),
      asyncHandler(this.controller.getUserDetailsHandler)
    )

    this.router.get('/list',
      validateSchemas(userSchemas.listAll, 'query'),
      asyncHandler(this.controller.listAllUsersHandler)
    )
  }
}

export default UserRoutes;