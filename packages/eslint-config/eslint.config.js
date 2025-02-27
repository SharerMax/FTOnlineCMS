import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-unused-vars': 'warn',
    'unused-imports/no-unused-vars': 'warn',
  },
})
