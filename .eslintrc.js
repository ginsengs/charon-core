module.exports = {
  'extends': [
    'airbnb-typescript/base',
    'plugin:import/typescript'
  ],
  'plugins': [
    'import',
    '@typescript-eslint'
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'project': [
      'tsconfig.json'
    ]
  },
  'rules': {
    'arrow-parens': 'off',
    'max-classes-per-file': 'off',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    'import/no-extraneous-dependencies': 'off'
  },
  'env': {
    'node': true
  },
  ignorePatterns: ['.eslintrc.js', 'test/__mock__/extension']
};
