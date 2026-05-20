/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/tests/**/*.test.ts?(x)'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          jsx: 'react-jsx',
          target: 'es2022',
          module: 'esnext',
          moduleResolution: 'bundler',
          esModuleInterop: true,
          verbatimModuleSyntax: false,
          erasableSyntaxOnly: false,
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@providers/(.*)$': '<rootDir>/src/providers/$1',
    '^@routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
    '^@typedef/(.*)$': '<rootDir>/src/typedef/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
