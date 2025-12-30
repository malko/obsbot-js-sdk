export default {
  testEnvironment: 'node',
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transform: {
    '^.+\\.(ts|js)$': ['ts-jest', { useESM: true, tsconfig: '<rootDir>/tsconfig.json', diagnostics: { ignoreCodes: [151002] } }],
  },
  moduleNameMapper: {
    '\\./build/Release/obsbot_native\\.node$': '<rootDir>/__mocks__/obsbot_native.js',
  },
  transformIgnorePatterns: ['/node_modules/(?!.*)'],
};
