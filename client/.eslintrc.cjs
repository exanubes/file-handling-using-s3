module.exports = {
	root: true,
	extends: ['eslint:recommended', 'plugin:svelte/recommended', 'prettier'],
	ignorePatterns: ["**/*", "**/*.ts"],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte'],
		requireConfigFile: false
	},
	parser: "@babel/eslint-parser",
	env: {
		browser: true,
		es2017: true,
		node: true
	}
};
