/** @type {import('jest').Config} */
module.exports = {
  // Use ts-jest preset for TypeScript support
  preset: 'ts-jest',
  
  // Set test environment to Node.js
  testEnvironment: 'node',
  
  // Test file patterns
  testMatch: [
    '**/test/**/*.spec.ts',
    '**/test/**/*.test.ts',
    '**/__tests__/**/*.ts',
  ],
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Transform configuration
  transform: {
    '^.+\.ts$': ['ts-jest', {
      tsconfig: {
        // Override some strict settings for tests
        exactOptionalPropertyTypes: false,
        noPropertyAccessFromIndexSignature: false,
      },
    }],
  },
  
  // Coverage configuration
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
  
  // Setup files
  setupFilesAfterEnv: [],
  
  // Clear mocks automatically between tests
  clearMocks: true,
  
  // Verbose output
  verbose: true,
};
