module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.cjs"],
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/(?!uuid|@dnd-kit/sortable)/"],
  testPathIgnorePatterns: ["/node_modules/", "/cypress/", "/playwright/"],
  moduleFileExtensions: ["js", "jsx", "json", "node"],
};
