import colors from 'vuetify/es5/util/colors';

export default {
	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		titleTemplate: '%s - Comp1640',
		title: 'Comp1640',
		htmlAttrs: {
			lang: 'en'
		},
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: '' },
			{ name: 'format-detection', content: 'telephone=no' }
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
		]
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: [
		'~/assets/style.css'
	],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		'~/plugins/getData',
		{ src: '~/plugins/vuex-persist', ssr: false },
		'~/plugins/checkRole'
	],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/vuetify
		'@nuxtjs/vuetify'
	],

	// Routes config
	router: {
		middleware: ['auth']
	},

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		// https://go.nuxtjs.dev/axios
		'@nuxtjs/axios',
		'@nuxtjs/auth-next'
	],

	// Axios module configuration: https://go.nuxtjs.dev/config-axios
	axios: {
		// Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
		baseURL: '/'
	},

	// Auth options
	auth: {
		plugins: ['~/plugins/auth'],
		strategies: {
			local: {
				scheme: 'refresh',
				endpoints: {
					login: { url: 'http://localhost:8080/auth/sign-in', post: 'post' },
					refresh: { url: 'http://localhost:8080/auth/refresh-token', post: 'post' },
					logout: { url: 'http://localhost:8080/auth/logout', post: 'post' },
					user: { url: 'http://localhost:8080/user/getUserInfo', post: 'get' }
				},
				token: {
					property: 'accessToken',
					data: 'accessToken',
					type: 'Bearer',
					maxAge: 60 * 60
				},
				refreshToken: {
					data: 'refreshToken',
					property: 'refreshToken',
					type: 'Bearer',
					maxAge: 60 * 60 * 3
				},
				user: {
					property: false
				},
				autoLogout: true
			}
		},
		redirect: {
			login: '/login',
			logout: '/'
		}
	},

	// Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
	vuetify: {
		customVariables: ['~/assets/variables.scss'],
		treeShake: true,
		options: {
			customProperties: true
		},
		theme: {
			dark: false,
			themes: {
				dark: {
					primary: colors.blue.darken2,
					accent: colors.grey.darken3,
					secondary: colors.amber.darken3,
					info: colors.teal.lighten1,
					warning: colors.amber.base,
					error: colors.deepOrange.accent4,
					success: colors.green.accent3
				}
			}
		}
	},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
		babel: {
			presets: ['@babel/preset-env']
		}
	}
};
