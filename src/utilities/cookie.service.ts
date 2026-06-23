import { CookieOptions, Response } from "express";
import config from "../config";

class CookieService {
  public setRefreshToken(res: Response, token: string): void {
    res.cookie('refreshToken', token, this.getRefreshTokenOptions());
  }

  public clearRefreshToken(res: Response): void {
    res.clearCookie('refreshToken', this.getRefreshTokenOptions());
  }

  private getRefreshTokenOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: this.parseExpiresInToMs(config.jwtRefreshExpiresIn),
    };
  }

  private parseExpiresInToMs(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000;

    const value = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return value * multipliers[unit];
  }
}

export default new CookieService();
