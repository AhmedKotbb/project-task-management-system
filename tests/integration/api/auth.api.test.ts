import { User } from "../../../src/database/models/user.model";
import * as hashService from "../../../src/utilities/hash.service";
import { createMockUser } from "../../helpers/mocks";

jest.mock("../../../src/database/models/user.model");
jest.mock("../../../src/utilities/hash.service");
jest.mock("../../../src/utilities/mail.service", () => ({
  __esModule: true,
  default: { sendInitialPasswordEmail: jest.fn() },
}));

import request from "supertest";
import { app } from "../../../src/app";
import { authHeader, adminPayload } from "../helpers/auth";

const MockedUser = User as jest.Mocked<typeof User>;
const mockedHash = hashService as jest.Mocked<typeof hashService>;

describe("Auth API", () => {
  describe("POST /api/auth/login", () => {
    it("returns 200 with tokens on valid credentials", async () => {
      const mockUser = createMockUser();
      MockedUser.findOne.mockResolvedValue(mockUser as never);
      mockedHash.verifyHash.mockResolvedValue(true);
      mockedHash.createHash.mockResolvedValue("hashed-refresh");

      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com", password: "password" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Login successful");
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.headers["set-cookie"]).toBeDefined();
    });

    it("returns 400 for invalid credentials", async () => {
      MockedUser.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "wrong@example.com", password: "password" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid email or password");
    });

    it("returns 400 for invalid request body", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "not-an-email" });

      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/auth/refresh-token", () => {
    it("returns 200 with new tokens when refresh cookie is valid", async () => {
      const mockUser = createMockUser();
      MockedUser.findOne.mockResolvedValue(mockUser as never);
      MockedUser.findByPk.mockResolvedValue(mockUser as never);
      mockedHash.verifyHash.mockResolvedValue(true);
      mockedHash.createHash.mockResolvedValue("new-hashed-refresh");

      const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com", password: "password" });

      expect(loginResponse.status).toBe(200);

      const cookies = loginResponse.headers["set-cookie"];
      expect(cookies).toBeDefined();

      const response = await request(app)
        .post("/api/auth/refresh-token")
        .set("Cookie", cookies!);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Refresh token successful");
      expect(response.body.data.accessToken).toBeDefined();
    });

    it("returns 401 without refresh cookie", async () => {
      const response = await request(app).post("/api/auth/refresh-token");

      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/auth/logout", () => {
    it("returns 200 and clears cookie when authenticated", async () => {
      const mockUser = createMockUser();
      MockedUser.findByPk.mockResolvedValue(mockUser as never);

      const response = await request(app)
        .post("/api/auth/logout")
        .set(authHeader());

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Logout successful");
      expect(mockUser.update).toHaveBeenCalledWith({ refreshToken: null });
    });

    it("returns 401 without access token", async () => {
      const response = await request(app).post("/api/auth/logout");

      expect(response.status).toBe(401);
    });
  });
});
