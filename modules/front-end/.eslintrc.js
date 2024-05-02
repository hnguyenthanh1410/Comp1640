module.exports = {
	root: true,
	env: {
		browser: true,
		node: true
	},
	parserOptions: {
		parser: '@babel/eslint-parser',
		requireConfigFile: false
	},
	extends: [
		'@nuxtjs',
		'plugin:nuxt/base'
	],
	plugins: [
	],
	// add your custom rules here
	rules: {
		indent: ['error', 'tab'],
		'no-tabs': ['off'],
		'no-console': ['off'],
		'no-trailing-spaces': ['error', {
			skipBlankLines: true
		}],
		'vue/html-indent': ['warn', 'tab', {
			baseIndent: 1
		}],
		'comma-dangle': ['error', 'never'],
		semi: ['error', 'always'],
		'no-empty': ['warn'],
		'no-lonely-if': ['off'],
		'arrow-parens': ['off'],
		curly: ['error', 'multi-line'],
		'no-unused-expressions': ['off'],
		quotes: ['off'],
		'no-useless-escape': ['off'],
		'no-return-assign': ['off'],
		'no-unused-vars': ["error", { destructuredArrayIgnorePattern: "^_" }]
	}
};
