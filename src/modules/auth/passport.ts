import passport from "passport";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import { Strategy as CustomStrategy } from "passport-custom";
import { Request } from "express";
import { User } from "../../database/models/user.model";
import { verifyHash } from "../../utilities/hash.service";
import tokenService from "../../utilities/token.service";
import { TokenPayload } from "./auth.interfaces";

passport.use(
  "bearer",
  new BearerStrategy((token, done) => {
    try {
      const payload = tokenService.verifyAccessToken(token);
      return done(null, payload);
    } catch {
      return done(null, false);
    }
  })
);

passport.use(
  "refresh-token",
  new CustomStrategy(async (req: Request, done) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return done(null, false);
      }

      const payload = tokenService.verifyRefreshToken(refreshToken);

      const user = await User.findByPk(payload.id);
      if (!user || user.dataValues.isDeleted) {
        return done(null, false);
      }

      const storedHash = user.dataValues.refreshToken;
      if (!storedHash) {
        return done(null, false);
      }

      const isValid = await verifyHash(refreshToken, storedHash);
      if (!isValid) {
        return done(null, false);
      }

      return done(null, payload);
    } catch {
      return done(null, false);
    }
  })
);

export default passport;
