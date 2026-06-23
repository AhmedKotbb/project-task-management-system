import jwt from "jsonwebtoken";
import config from "../config";
import { APIError } from "../shared/errors";
import { TokenPayload } from "../modules/auth/auth.interfaces";


class TokenService {

  public generateTokenPair(payload: TokenPayload) {
    const accessToken = jwt.sign(payload, config.jwtAccessSecret, {
      expiresIn: config.jwtAccessExpiresIn as jwt.SignOptions["expiresIn"],
    });

    const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, {
      expiresIn: config.jwtRefreshExpiresIn as jwt.SignOptions["expiresIn"],
    });

    return { accessToken, refreshToken };
  }

  public verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, config.jwtAccessSecret) as TokenPayload;
    } catch {
      throw APIError.UnAuthorized("Invalid or expired access token");
    }
  }

  public verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, config.jwtRefreshSecret) as TokenPayload;
    } catch {
      throw APIError.UnAuthorized("Invalid or expired refresh token");
    }
  }

}

export default new TokenService();