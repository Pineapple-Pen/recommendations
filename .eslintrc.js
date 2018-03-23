module.exports = {
  extends: 'airbnb',
  rules: {
    'no-console': 'off',
    'import/extensions': 'always',
    'react/forbid-prop-types': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'comma-dangle': 'off',
    'no-shadow': 'off',
    'no-await-in-loop': 'off'
  },
  env: {
    "browser": true,
    "node": true,
    "jest": true
  }
};