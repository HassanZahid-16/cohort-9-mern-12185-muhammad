module.exports = {
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },

  moduleFileExtensions: ["js", "jsx"],

  testMatch: [
    "<rootDir>/test/**/*.test.js",
    "<rootDir>/test/**/*.test.jsx",
  ],

  setupFilesAfterEnv: ["<rootDir>/test/setup.js"],

  moduleNameMapper: {
    "\\.(css)$": "<rootDir>/test/styleMock.cjs",
  },
};