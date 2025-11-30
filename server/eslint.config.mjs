// @ts-check
import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier'; // Добавь это
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.*'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettier, // Отключает правила ESLint, которые конфликтуют с Prettier
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'prettier/prettier': 'off', // Отключаем правило prettier в ESLint
    },
  },
);