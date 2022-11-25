module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'array-bracket-spacing': 'off',
    'brace-style': 'off',
    curly: 'off',
    indent: 'off',
    'new-cap': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-useless-constructor': 'off',
    // 'no-tabs': [ 'error', { allowIndentationTabs: true } ],
    'no-tabs': 'off',
    'space-before-function-paren': 'off',
    'vue/html-indent': [
      'error',
      'tab'
    ],
    semi: [
      'error',
      'always'
    ]
  }
};
