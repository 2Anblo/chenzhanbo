import nextConfig from 'eslint-config-next'

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  ...nextConfig,
  {
    rules: {
      // The experimental react-hooks rules below are too strict for the current
      // codebase and flag common React patterns (e.g. passing refs to elements,
      // deriving state in effects). Disable them until they mature.
      'react-hooks/refs': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]

export default eslintConfig
