
import type { Config } from '@jest/types';


export default <Config.InitialOptions>{
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  roots: [
    '<rootDir>/src/',
  ],
  testMatch: [
    '**/*.test.ts',
  ],
  collectCoverageFrom: [
    '**/*.ts',
  ],
  errorOnDeprecated: true,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.lib.json',
    },
  },
};
