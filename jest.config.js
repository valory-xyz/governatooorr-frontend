module.exports = {
  verbose: true,
  setupFilesAfterEnv: ["./jest.setup.js"],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.less$": "<rootDir>/node_modules/antd/lib/style/css.js",
  },
  transformIgnorePatterns: ["node_modules/antd/lib/style/"],
};
