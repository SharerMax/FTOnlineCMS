import type antfu from '@antfu/eslint-config'

export const antfuConfigOption: Parameters<typeof antfu>[0] = {
  vue: {
    overrides: {
      'vue/block-order': ['warn', {
        order: ['template', 'script', 'style'],
      }],
    },
  },
  rules: {
    'no-unused-vars': 'warn',
    'unused-imports/no-unused-vars': 'warn',
  },
}
