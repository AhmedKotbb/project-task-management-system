import tokenService from "../../../src/utilities/token.service";
import { TokenPayload } from "../../../src/modules/auth/auth.interfaces";
import { adminPayload, memberPayload } from "../../helpers/mocks";

export function getAccessToken(payload: TokenPayload = adminPayload): string {
  return tokenService.generateTokenPair(payload).accessToken;
}

export function authHeader(payload: TokenPayload = adminPayload): {
  Authorization: string;
} {
  return { Authorization: `Bearer ${getAccessToken(payload)}` };
}

export { adminPayload, memberPayload };
