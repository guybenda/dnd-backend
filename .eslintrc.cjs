module.exports = {
	root: true,
	env: {
		es6: true,
		node: true,
	},
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: ["./tsconfig.json"],
		sourceType: "module",
	},
	ignorePatterns: [
		"/build/**/*", // Ignore built files.
		"/node_modules/**/*", // Ignore node_modules.
	],
	plugins: ["@typescript-eslint"],
	rules: {
		"import/no-unresolved": 0,
		eqeqeq: 1,
	},
};
