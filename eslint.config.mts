import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import eslintConfigPrettier from 'eslint-config-prettier'

export default defineConfig([
	{ ignores: ['dist/*', 'node_modules/*'] },
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
		plugins: { js, 'simple-import-sort': simpleImportSort },
		extends: ['js/recommended'],
		languageOptions: { globals: globals.node },
	},

	tseslint.configs.recommended,
	{
		rules: {
			'prefer-const': 'warn',
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',
			'simple-import-sort/imports': 'error',
			/* 'simple-import-sort/exports': 'error', */
		},
	},
	eslintConfigPrettier,
])
