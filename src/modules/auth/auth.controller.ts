import { Request, Response } from "express";
import { responseHandler } from "../../shared/api-response";
import cookieService from "../../utilities/cookie.service";
import AuthService from "./auth.service";
import { TokenPayload } from "./auth.interfaces";

class AuthController {
  private service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  public loginHandler = async (req: Request, res: Response) => {
    const { accessToken, refreshToken } = await this.service.login(
      req.body.email,
      req.body.password
    );

    cookieService.setRefreshToken(res, refreshToken);
    responseHandler(res, 200, "Login successful", { accessToken, refreshToken });
  };

  public refreshTokenHandler = async (req: Request, res: Response) => {
    const { accessToken, refreshToken } = await this.service.refreshToken(req.user as TokenPayload);
    cookieService.setRefreshToken(res, refreshToken);
    responseHandler(res, 200, "Refresh token successful", { accessToken, refreshToken });
  };

  public logoutHandler = async (req: Request, res: Response) => {
    await this.service.logout(req.user as TokenPayload);
    cookieService.clearRefreshToken(res);
    responseHandler(res, 200, "Logout successful");
  };
}

export default AuthController;
