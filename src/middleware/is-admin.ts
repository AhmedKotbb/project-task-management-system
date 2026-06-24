import { Request, Response, NextFunction } from "express";
import { TokenPayload } from "../modules/auth/auth.interfaces";
import { APIError } from "../shared/errors";

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { role } = req.user as TokenPayload;
  if (role !== "admin") {
    throw APIError.Forbidden("You are not authorized to do this action");
  }
  next();
}