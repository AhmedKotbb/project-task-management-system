/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  clearMocks: true,
  restoreMocks: true,
  setupFilesAfterEnv: ["<rootDir>/tests/setup/jest.setup.ts"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json",
      },
    ],
  },
  collectCoverageFrom: [
    "src/modules/**/*.ts",
    "src/middleware/**/*.ts",
    "src/shared/**/*.ts",
    "!src/**/*.interfaces.ts",
    "!src/**/*.dtos.ts",
    "!src/**/*.schemas.ts",
  ],
  coverageDirectory: "coverage",
  verbose: true,
};
