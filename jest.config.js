/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
    // The test environment that will be used for testing
    testEnvironment: "jsdom",
    // The glob patterns Jest uses to detect test files
    testMatch: [
      "**/*.spec.js",
    ],
    testTimeout: 1000 * 10,
    transform: {} 
};
  