import { Request, Response, NextFunction } from "express";
import passport from "../modules/auth/passport";
import { TokenPayload } from "../modules/auth/auth.interfaces";
import { APIError } from "../shared/errors";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "bearer",
    { session: false },
    (err: Error | null, user: TokenPayload | false) => {
      if (err) return next(err);

      if (!user) {
        // return res.status(401).json({ message: "Unauthorized" });
        throw APIError.UnAuthorized("Invalid or expired access token");
      }

      req.user = user;
      next();
    }
  )(req, res, next);
};