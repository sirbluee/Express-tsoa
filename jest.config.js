module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[t]s?(x)'],  // Looks for .test.ts or .spec.ts files
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',  // Transforms TypeScript files with ts-jest
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],  // Ignore these directories
};
