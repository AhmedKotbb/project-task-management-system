import { User } from "../../../../src/database/models/user.model";
import { APIError } from "../../../../src/shared/errors";
import * as hashService from "../../../../src/utilities/hash.service";
import MailService from "../../../../src/utilities/mail.service";
import UserService from "../../../../src/modules/users/user.service";
import { adminPayload } from "../../../helpers/mocks";
import { createMockUser } from "../../../helpers/mocks";

jest.mock("../../../../src/database/models/user.model");
jest.mock("../../../../src/utilities/hash.service");
jest.mock("../../../../src/utilities/mail.service", () => ({
  __esModule: true,
  default: {
    sendInitialPasswordEmail: jest.fn(),
  },
}));

const MockedUser = User as jest.Mocked<typeof User>;
const mockedHash = hashService as jest.Mocked<typeof hashService>;

describe("UserService", () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  describe("createNewUser", () => {
    const dto = {
      fullName: "New User",
      email: "new@example.com",
      phoneNumber: "9876543210",
      role: "member" as const,
    };

    it("creates user when email and phone are unique", async () => {
      MockedUser.findOne.mockResolvedValue(null);
      mockedHash.createHash.mockResolvedValue("hashed-password");
      MockedUser.create.mockResolvedValue({} as never);

      await service.createNewUser(dto);

      expect(MailService.sendInitialPasswordEmail).toHaveBeenCalledWith(
        dto.email,
        expect.any(String),
      );
      expect(MockedUser.create).toHaveBeenCalledWith({
        ...dto,
        password: "hashed-password",
      });
    });

    it("throws when email already exists", async () => {
      MockedUser.findOne
        .mockResolvedValueOnce(createMockUser() as never)
        .mockResolvedValueOnce(null);

      await expect(service.createNewUser(dto)).rejects.toThrow(
        APIError.BadRequest("The email is already associated with an existing user"),
      );
    });

    it("throws when phone number already exists", async () => {
      MockedUser.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(createMockUser() as never);

      await expect(service.createNewUser(dto)).rejects.toThrow(
        APIError.BadRequest("The phone number is already associated with an existing user"),
      );
    });
  });

  describe("getUserDetails", () => {
    it("returns user when found", async () => {
      const mockUser = createMockUser();
      MockedUser.findByPk.mockResolvedValue(mockUser as never);

      const result = await service.getUserDetails(adminPayload.id);

      expect(result).toBe(mockUser);
      expect(MockedUser.findByPk).toHaveBeenCalledWith(adminPayload.id, {
        attributes: { exclude: ["password", "refreshToken"] },
      });
    });

    it("throws NotFound when user does not exist", async () => {
      MockedUser.findByPk.mockResolvedValue(null);

      await expect(service.getUserDetails(adminPayload.id)).rejects.toThrow(
        APIError.NotFound("User not found"),
      );
    });
  });

  describe("listAllUsers", () => {
    it("returns paginated users", async () => {
      const rows = [createMockUser()];
      MockedUser.findAndCountAll.mockResolvedValue({ count: 1, rows } as never);

      const result = await service.listAllUsers({ page: 1, limit: 10 });

      expect(result).toEqual({
        totalItems: 1,
        totalPages: 1,
        currentPage: 1,
        rows,
      });
    });
  });

  describe("changePassword", () => {
    const dto = {
      oldPassword: "OldPass1!",
      newPassword: "NewPass2@",
      confirmPassword: "NewPass2@",
    };

    it("updates password when validation passes", async () => {
      const mockUser = createMockUser();
      MockedUser.findByPk.mockResolvedValue(mockUser as never);
      mockedHash.verifyHash.mockResolvedValue(true);
      mockedHash.createHash.mockResolvedValue("new-hashed");

      await service.changePassword(dto, adminPayload);

      expect(mockUser.update).toHaveBeenCalledWith({
        password: "new-hashed",
        isFirstLogin: false,
      });
    });

    it("throws when passwords do not match", async () => {
      await expect(
        service.changePassword(
          { ...dto, confirmPassword: "Different1!" },
          adminPayload,
        ),
      ).rejects.toThrow(
        APIError.BadRequest("New password and confirm password do not match"),
      );
    });

    it("throws when new password equals old password", async () => {
      await expect(
        service.changePassword(
          { oldPassword: "SamePass1!", newPassword: "SamePass1!", confirmPassword: "SamePass1!" },
          adminPayload,
        ),
      ).rejects.toThrow(
        APIError.BadRequest("New password cannot be the same as the old password"),
      );
    });

    it("throws when old password is incorrect", async () => {
      MockedUser.findByPk.mockResolvedValue(createMockUser() as never);
      mockedHash.verifyHash.mockResolvedValue(false);

      await expect(service.changePassword(dto, adminPayload)).rejects.toThrow(
        APIError.BadRequest("Old password is incorrect"),
      );
    });
  });
});
