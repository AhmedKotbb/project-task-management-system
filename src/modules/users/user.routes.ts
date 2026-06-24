import { Router } from "express";
import UserController from "./user.controller";
import asyncHandler from "../../middleware/async-wrapper";
import { validateSchemas } from "../../middleware/validate-schemas";
import { userSchemas } from "./user.schemas";
import { authenticate } from "../../middleware/authenticate";

class UserRoutes {
  public readonly router: Router = Router();
  private readonly controller: UserController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/create',
      authenticate,
      validateSchemas(userSchemas.createUser),
      asyncHandler(this.controller.createNewUserHandler)
    )

    this.router.get('/details/:id',
      authenticate,
      validateSchemas(userSchemas.details, 'params'),
      asyncHandler(this.controller.getUserDetailsHandler)
    )

    this.router.get('/list',
      authenticate,
      validateSchemas(userSchemas.listAll, 'query'),
      asyncHandler(this.controller.listAllUsersHandler)
    )

    this.router.patch('/change-password',
      authenticate,
      validateSchemas(userSchemas.changePassword),
      asyncHandler(this.controller.changePasswordHandler)
    )
  }
}

export default UserRoutes;