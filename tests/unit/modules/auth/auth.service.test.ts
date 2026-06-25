import { User } from "../../../../src/database/models/user.model";
import { APIError } from "../../../../src/shared/errors";
import * as hashService from "../../../../src/utilities/hash.service";
import tokenService from "../../../../src/utilities/token.service";
import AuthService from "../../../../src/modules/auth/auth.service";
import { createMockUser, adminPayload } from "../../../helpers/mocks";

jest.mock("../../../../src/database/models/user.model");
jest.mock("../../../../src/utilities/hash.service");
jest.mock("../../../../src/utilities/token.service", () => ({
  __esModule: true,
  default: {
    generateTokenPair: jest.fn(),
  },
}));

const MockedUser = User as jest.Mocked<typeof User>;
const mockedHash = hashService as jest.Mocked<typeof hashService>;
const mockedTokenService = tokenService as jest.Mocked<typeof tokenService>;

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService();
  });

  describe("login", () => {
    it("returns tokens when credentials are valid", async () => {
      const mockUser = createMockUser();
      MockedUser.findOne.mockResolvedValue(mockUser as never);
      mockedHash.verifyHash.mockResolvedValue(true);
      mockedHash.createHash.mockResolvedValue("new-hashed-refresh");
      mockedTokenService.generateTokenPair.mockReturnValue({
        accessToken: "access-token",
        refreshToken: "refresh-token",
      });

      const result = await service.login("test@example.com", "password");

      expect(result).toEqual({
        accessToken: "access-token",
        refreshToken: "refresh-token",
      });
      expect(mockUser.update).toHaveBeenCalledWith(
        expect.objectContaining({
          refreshToken: "new-hashed-refresh",
          lastLoginAt: expect.any(Date),
        }),
      );
    });

    it("throws BadRequest when user is not found", async () => {
      MockedUser.findOne.mockResolvedValue(null);

      await expect(service.login("unknown@example.com", "password")).rejects.toThrow(
        APIError.BadRequest("Invalid email or password"),
      );
    });

    it("throws BadRequest when password is invalid", async () => {
      MockedUser.findOne.mockResolvedValue(createMockUser() as never);
      mockedHash.verifyHash.mockResolvedValue(false);

      await expect(service.login("test@example.com", "wrong")).rejects.toThrow(
        APIError.BadRequest("Invalid email or password"),
      );
    });
  });

  describe("refreshToken", () => {
    it("returns new token pair for valid user", async () => {
      const mockUser = createMockUser();
      MockedUser.findByPk.mockResolvedValue(mockUser as never);
      mockedHash.createHash.mockResolvedValue("new-hashed-refresh");
      mockedTokenService.generateTokenPair.mockReturnValue({
        accessToken: "new-access",
        refreshToken: "new-refresh",
      });

      const result = await service.refreshToken(adminPayload);

      expect(result).toEqual({
        accessToken: "new-access",
        refreshToken: "new-refresh",
      });
      expect(mockUser.update).toHaveBeenCalledWith({ refreshToken: "new-hashed-refresh" });
    });

    it("throws BadRequest when user does not exist", async () => {
      MockedUser.findByPk.mockResolvedValue(null);

      await expect(service.refreshToken(adminPayload)).rejects.toThrow(
        APIError.BadRequest("Invalid user"),
      );
    });

    it("throws BadRequest when user is deleted", async () => {
      MockedUser.findByPk.mockResolvedValue(
        createMockUser({ isDeleted: true }) as never,
      );

      await expect(service.refreshToken(adminPayload)).rejects.toThrow(
        APIError.BadRequest("Invalid user"),
      );
    });
  });

  describe("logout", () => {
    it("clears refresh token for valid user", async () => {
      const mockUser = createMockUser();
      MockedUser.findByPk.mockResolvedValue(mockUser as never);

      await service.logout(adminPayload);

      expect(mockUser.update).toHaveBeenCalledWith({ refreshToken: null });
    });

    it("throws BadRequest when user is not found", async () => {
      MockedUser.findByPk.mockResolvedValue(null);

      await expect(service.logout(adminPayload)).rejects.toThrow(
        APIError.BadRequest("Invalid user"),
      );
    });
  });
});
