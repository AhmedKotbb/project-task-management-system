import { User } from "../../database/models/user.model";
import { APIError } from "../../shared/errors";
import { createHash, verifyHash } from "../../utilities/hash.service";
import tokenService from "../../utilities/token.service";
import { TokenPayload } from "./auth.interfaces";

class AuthService {

  public async login(email: string, password: string) {
    const user = await User.findOne({ where: { email, isDeleted: false } });
    if (!user) throw APIError.BadRequest("Invalid email or password");

    const isPasswordValid = await verifyHash(password, user.dataValues.password);
    if (!isPasswordValid) throw APIError.BadRequest("Invalid email or password");

    const { accessToken, refreshToken } = tokenService.generateTokenPair({
      id: user.dataValues.id,
      role: user.dataValues.role,
      email: user.dataValues.email,
    });

    const hashedRefreshToken = await createHash(refreshToken);
    await user.update({
      refreshToken: hashedRefreshToken,
      lastLoginAt: new Date(),
    });

    return { accessToken, refreshToken };

  }

  public async refreshToken(payload: TokenPayload) {
    const { id } = payload;
    const user = await User.findByPk(id);
    if (!user) throw APIError.BadRequest("Invalid user");
    if (user.dataValues.isDeleted) throw APIError.BadRequest("Invalid user");

    const { accessToken, refreshToken } = await tokenService.generateTokenPair({
      id: user.dataValues.id,
      role: user.dataValues.role,
      email: user.dataValues.email,
    });

    const hashedRefreshToken = await createHash(refreshToken);
    await user.update({
      refreshToken: hashedRefreshToken,
    });

    return { accessToken, refreshToken };
  }

  public async logout(payload: TokenPayload) {
    const { id } = payload;
    const user = await User.findByPk(id);
    if (!user) throw APIError.BadRequest("Invalid user");
    if (user.dataValues.isDeleted) throw APIError.BadRequest("Invalid user");

    await user.update({ refreshToken: null });

  }

}

export default AuthService;