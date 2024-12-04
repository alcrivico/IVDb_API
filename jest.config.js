module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  testPathIgnorePatterns: ["/node_modules/"],
  verbose: true,
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.js"],
  globalSetup: "<rootDir>/__tests__/globalSetup.js",
};
