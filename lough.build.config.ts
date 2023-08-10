import { defineConfig } from '@lough/build-cli';

export default defineConfig({
  external: ['@logically/coding-model', '@logically/types'],
  globals: { '@logically/coding-model': 'logicallyCodingModel', '@logically/types': 'logicallyTypes' },
  terser: false,
  style: false,
  input: 'src/index.ts'
});
