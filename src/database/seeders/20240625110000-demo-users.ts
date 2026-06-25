import bcrypt from "bcrypt";
import { QueryInterface } from "sequelize";

const ADMIN_ID = "a0000000-0000-4000-8000-000000000001";
const MEMBER_ONE_ID = "a0000000-0000-4000-8000-000000000002";
const MEMBER_TWO_ID = "a0000000-0000-4000-8000-000000000003";

const DEMO_PASSWORD = "Password123!";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
    const now = new Date();

    await queryInterface.bulkInsert("users", [
      {
        id: ADMIN_ID,
        fullName: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        phoneNumber: "1000000001",
        role: "admin",
        isDeleted: false,
        lastLoginAt: null,
        refreshToken: null,
        isFirstLogin: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: MEMBER_ONE_ID,
        fullName: "Jane Member",
        email: "jane@example.com",
        password: hashedPassword,
        phoneNumber: "1000000002",
        role: "member",
        isDeleted: false,
        lastLoginAt: null,
        refreshToken: null,
        isFirstLogin: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: MEMBER_TWO_ID,
        fullName: "John Member",
        email: "john@example.com",
        password: hashedPassword,
        phoneNumber: "1000000003",
        role: "member",
        isDeleted: false,
        lastLoginAt: null,
        refreshToken: null,
        isFirstLogin: false,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("users", {
      id: [ADMIN_ID, MEMBER_ONE_ID, MEMBER_TWO_ID],
    });
  },
};
