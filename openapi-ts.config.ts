import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: 'http://localhost:3000/api-docs-json',
  output: {
    path: 'src/client',
    postProcess: ['prettier', 'oxlint'],
  },
  client: '@hey-api/client-fetch',
  types: {
    enums: 'javascript',
  },
  services: {
    export: true,
    name: 'DefaultService',
  },
})
