import { defineConfig } from 'vite'
const { resolve } = require('path')

module.exports = defineConfig({
	plugins: [
		{
			name: 'configure-response-headers',
			configureServer: server => {
				server.middlewares.use((_req, res, next) => {
					res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
					res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
					next()
				})
			},
		},
	],
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				nested: resolve(__dirname, 'slide/index.html'),
			},
			output: {
				dir: '../dist/client',
			},
		},
	},
	server: {
		cors: false,
		proxy: {
			'/api': {
				target: 'http://localhost:4000/api',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api/, ''),
			},
		},
	},
})
