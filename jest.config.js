module.exports = {
  testEnvironment: 'node',
  // Automatically mock the native addon for all tests
  moduleNameMapper: {
    '\\./build/Release/obsbot_native\\.node$': '<rootDir>/__mocks__/obsbot_native.js',
  },
};
