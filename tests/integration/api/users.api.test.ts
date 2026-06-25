import { User } from "../../../src/database/models/user.model";
import * as hashService from "../../../src/utilities/hash.service";

jest.mock("../../../src/database/models/user.model");
jest.mock("../../../src/utilities/hash.service");
jest.mock("../../../src/utilities/mail.service", () => ({
  __esModule: true,
  default: { sendInitialPasswordEmail: jest.fn() },
}));

import request from "supertest";
import { app } from "../../../src/app";
import { authHeader, adminPayload, memberPayload } from "../helpers/auth";
import { createMockUser, TEST_USER_ID } from "../../helpers/mocks";

const MockedUser = User as jest.Mocked<typeof User>;
const mockedHash = hashService as jest.Mocked<typeof hashService>;

describe("Users API", () => {
  describe("POST /api/users/create", () => {
    const validBody = {
    fullName: "New User",
    email: "new@example.com",
    phoneNumber: "9876543210",
    role: "member",
  };

    it("returns 201 when admin creates user", async () => {
      MockedUser.findOne.mockResolvedValue(null);
      mockedHash.createHash.mockResolvedValue("hashed");
      MockedUser.create.mockResolvedValue({} as never);

      const response = await request(app)
        .post("/api/users/create")
        .set(authHeader(adminPayload))
        .send(validBody);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User created successfully");
    });

    it("returns 403 when member tries to create user", async () => {
      const response = await request(app)
        .post("/api/users/create")
        .set(authHeader(memberPayload))
        .send(validBody);

      expect(response.status).toBe(403);
    });

    it("returns 401 without token", async () => {
      const response = await request(app).post("/api/users/create").send(validBody);

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/users/details/:id", () => {
    it("returns 200 with user details", async () => {
      const user = createMockUser();
      MockedUser.findByPk.mockResolvedValue(user as never);

      const response = await request(app)
        .get(`/api/users/details/${TEST_USER_ID}`)
        .set(authHeader());

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User details fetched successfully");
    });

    it("returns 404 when user not found", async () => {
      MockedUser.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .get(`/api/users/details/${TEST_USER_ID}`)
        .set(authHeader());

      expect(response.status).toBe(404);
    });
  });

  describe("GET /api/users/list", () => {
    it("returns 200 with paginated users", async () => {
      MockedUser.findAndCountAll.mockResolvedValue({
        count: 1,
        rows: [createMockUser()],
      } as never);

      const response = await request(app)
        .get("/api/users/list")
        .query({ page: 1 })
        .set(authHeader());

      expect(response.status).toBe(200);
      expect(response.body.data.totalItems).toBe(1);
    });

    it("returns 400 when page is missing", async () => {
      const response = await request(app)
        .get("/api/users/list")
        .set(authHeader());

      expect(response.status).toBe(400);
    });
  });

  describe("PATCH /api/users/change-password", () => {
    it("returns 200 when password changed successfully", async () => {
      const user = createMockUser();
      MockedUser.findByPk.mockResolvedValue(user as never);
      mockedHash.verifyHash.mockResolvedValue(true);
      mockedHash.createHash.mockResolvedValue("new-hash");

      const response = await request(app)
        .patch("/api/users/change-password")
        .set(authHeader())
        .send({
          oldPassword: "OldPass1!",
          newPassword: "NewPass2@",
          confirmPassword: "NewPass2@",
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Password changed successfully");
    });

    it("returns 400 when passwords do not match", async () => {
      const response = await request(app)
        .patch("/api/users/change-password")
        .set(authHeader())
        .send({
          oldPassword: "OldPass1!",
          newPassword: "NewPass2@",
          confirmPassword: "Different1!",
        });

      expect(response.status).toBe(400);
    });
  });
});
