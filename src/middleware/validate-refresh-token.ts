import { Request, Response, NextFunction } from "express";
import passport from "../modules/auth/passport";
import {
  TokenPayload,
} from "../modules/auth/auth.interfaces";
import { APIError } from "../shared/errors";

export const validateRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "refresh-token",
    { session: false },
    (err: Error | null, user: TokenPayload | false) => {
      if (err) return next(err);

      if (!user) {
        return next(APIError.UnAuthorized("Invalid or expired refresh token"));
      }

      req.user = user;
      next();
    }
  )(req, res, next);
};
