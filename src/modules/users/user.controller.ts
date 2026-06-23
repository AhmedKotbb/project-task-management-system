import { Request, Response, NextFunction } from 'express';
import UserService from './user.service';
import { responseHandler } from '../../shared/api-response';

class UserController {
  private service: UserService;

  constructor() {
      this.service = new UserService()
  }

  public createNewUserHandler = async (req: Request, res: Response, next: NextFunction) => {
    await this.service.createNewUser(req.body);
    responseHandler(res, 201, "User created successfully");
  }

  public getUserDetailsHandler = async (req: Request, res: Response, next: NextFunction) => {
    const user = await this.service.getUserDetails(req.params.id as string);
    responseHandler(res, 200, "User details fetched successfully", user);
  }

  public listAllUsersHandler = async (req: Request, res: Response, next: NextFunction) => {
    const data = await this.service.listAllUsers(req.query);
    responseHandler(res, 200, "Users fetched successfully", data);
  }


}

export default UserController;