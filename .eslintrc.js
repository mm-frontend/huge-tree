module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  extends: ['prettier', 'plugin:vue/essential'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['warn'],
    'no-param-reassign': ['off'],
    'space-before-function-paren': ['warn', 'never'],
  },
};
