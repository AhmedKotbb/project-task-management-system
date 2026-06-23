import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';
import { responseHandler } from '../utilities/api-response';

class UserController {
  private readonly service: UserService;
  constructor() {
    this.service = new UserService();
  }

  public async createNewUserHandler(req: Request, res: Response, next: NextFunction) {
    await this.service.createNewUser();
    responseHandler(res, 201, "User created successfully");
  }
}

export default UserController;