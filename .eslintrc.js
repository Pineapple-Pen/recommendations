module.exports = {
  extends: 'airbnb',
  rules: {
    'no-console': 'off',
    'import/extensions': 'always',
    'react/forbid-prop-types': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
  },
  env: {
    "browser": true,
    "node": true,
    "jest": true
  }
};