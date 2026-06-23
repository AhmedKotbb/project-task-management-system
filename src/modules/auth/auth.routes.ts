import { Router } from "express";
import asyncHandler from "../../middleware/async-wrapper";
import { validateRefreshToken } from "../../middleware/validate-refresh-token";
import { validateSchemas } from "../../middleware/validate-schemas";
import AuthController from "./auth.controller";
import { authSchemas } from "./auth.schemas";
import { authenticate } from "../../middleware/authenticate";

class AuthRoutes {
  public readonly router: Router = Router();
  private readonly controller: AuthController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      "/login",
      validateSchemas(authSchemas.login),
      asyncHandler(this.controller.loginHandler)
    );

    this.router.post(
      "/refresh-token",
      validateRefreshToken,
      asyncHandler(this.controller.refreshTokenHandler)
    );

    this.router.post(
      "/logout",
      authenticate,
      asyncHandler(this.controller.logoutHandler)
    );

  }

}

export default AuthRoutes