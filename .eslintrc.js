module.exports = {
  extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './src/tsconfig.json',
  },
  env: {
    node: true,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        /**
         * 多行声明, 不需要任何符号结尾
         *
         * eg.
         * interface Bar {
         *   foo: number
         * }
         */
        multiline: {
          delimiter: 'none',
          requireLast: false,
        },
        /**
         * 声明单行使用分号隔开, 末尾必须带分号
         *
         * eg.
         * interface Bar { foo: number; }
         */
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
  },
}
