import {defineConfig} from '@sanity/pkg-utils'

export default defineConfig({
  extract: {
    rules: {
      'ae-missing-release-tag': 'off',
      'tsdoc-undefined-tag': 'off',
    },
  },

  legacyExports: true,

  tsconfig: 'tsconfig.dist.json',
})
