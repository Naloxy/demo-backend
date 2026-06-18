import type { Config } from 'jest';
import { createDefaultEsmPreset } from 'ts-jest';

const defaultEsmPreset = createDefaultEsmPreset();

const config: Config = {
  ...defaultEsmPreset,
  testEnvironment: 'node',
  // Tells Jest to treat all .ts files as ESM
  extensionsToTreatAsEsm: ['.ts'], 
};

export default config;
