const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: [
		'./index.html',
		'./src/**/*.{vue,js,ts,jsx,tsx}',
		'../../packages/hephaestus/components/*.{vue,js,ts,jsx,tsx}',
	],
	safelist: [
		{ pattern: /(flex|block|relative|absolute)/},
		{ pattern: /(shrink|rounded)-./},
		{ pattern: /(text|bg)-./, variants: ['hover', 'focus', 'focus-within', 'active', 'disabled', 'group-hover'] },
		{ pattern: /(p|pl|pt|pr|pb|py|px)-./ },
		{ pattern: /(m|ml|mt|mr|mb)-./ },
		{ pattern: /(w|max-w|h|max-h|min-w|min-h)-./ },
		{ pattern: /(size)-./ },
		{ pattern: /rotate-./, variants: ['hover'] },
		{ pattern: /opacity-./, variants: ['hover', 'group-hover'] },
		{ pattern: /border-(t|l|r|b|x|y)/ },
		{ pattern: /border-(t|l|r|b|x|y)-./ },
	],
	theme: {
		fontFamily: {
			roboto: ['Roboto', 'sans-serif'],
			lato: ['Lato', 'sans-serif'],
			railway: ['Railway', 'sans-serif'],
		},
		extend: {
            height: {
                inherit: 'inherit',
            },
			colors: {
				primary: {
					50: 'rgb(var(--color-primary-50) / <alpha-value>)',
					75: 'rgb(var(--color-primary-75) / <alpha-value>)',
					100: 'rgb(var(--color-primary-100) / <alpha-value>)',
					200: 'rgb(var(--color-primary-200) / <alpha-value>)',
					300: 'rgb(var(--color-primary-300) / <alpha-value>)',
					400: 'rgb(var(--color-primary-400) / <alpha-value>)',
					500: 'rgb(var(--color-primary-500) / <alpha-value>)',
				},
				secondary: {
					50: 'rgb(var(--color-secondary-50) / <alpha-value>)',
					75: 'rgb(var(--color-secondary-75) / <alpha-value>)',
					100: 'rgb(var(--color-secondary-100) / <alpha-value>)',
					200: 'rgb(var(--color-secondary-200) / <alpha-value>)',
					300: 'rgb(var(--color-secondary-300) / <alpha-value>)',
					400: 'rgb(var(--color-secondary-400) / <alpha-value>)',
					500: 'rgb(var(--color-secondary-500) / <alpha-value>)',
				},
				success: {
					50: 'rgb(var(--color-success-50) / <alpha-value>)',
					75: 'rgb(var(--color-success-75) / <alpha-value>)',
					100: 'rgb(var(--color-success-100) / <alpha-value>)',
					200: 'rgb(var(--color-success-200) / <alpha-value>)',
					300: 'rgb(var(--color-success-300) / <alpha-value>)',
					400: 'rgb(var(--color-success-400) / <alpha-value>)',
					500: 'rgb(var(--color-success-500) / <alpha-value>)',
				},
				danger: {
					50: 'rgb(var(--color-danger-50) / <alpha-value>)',
					75: 'rgb(var(--color-danger-75) / <alpha-value>)',
					100: 'rgb(var(--color-danger-100) / <alpha-value>)',
					200: 'rgb(var(--color-danger-200) / <alpha-value>)',
					300: 'rgb(var(--color-danger-300) / <alpha-value>)',
					400: 'rgb(var(--color-danger-400) / <alpha-value>)',
					500: 'rgb(var(--color-danger-500) / <alpha-value>)',
				},
				info: {
					50: 'rgb(var(--color-info-50) / <alpha-value>)',
					75: 'rgb(var(--color-info-75) / <alpha-value>)',
					100: 'rgb(var(--color-info-100) / <alpha-value>)',
					200: 'rgb(var(--color-info-200) / <alpha-value>)',
					300: 'rgb(var(--color-info-300) / <alpha-value>)',
					400: 'rgb(var(--color-info-400) / <alpha-value>)',
					500: 'rgb(var(--color-info-500) / <alpha-value>)',
				},
				warning: {
					50: 'rgb(var(--color-warning-50) / <alpha-value>)',
					75: 'rgb(var(--color-warning-75) / <alpha-value>)',
					100: 'rgb(var(--color-warning-100) / <alpha-value>)',
					200: 'rgb(var(--color-warning-200) / <alpha-value>)',
					300: 'rgb(var(--color-warning-300) / <alpha-value>)',
					400: 'rgb(var(--color-warning-400) / <alpha-value>)',
					500: 'rgb(var(--color-warning-500) / <alpha-value>)',
				},
				body: {
					0: 'rgb(var(--color-body-0) / <alpha-value>)',
					10: 'rgb(var(--color-body-10) / <alpha-value>)',
					20: 'rgb(var(--color-body-20) / <alpha-value>)',
					30: 'rgb(var(--color-body-30) / <alpha-value>)',
					40: 'rgb(var(--color-body-40) / <alpha-value>)',
					50: 'rgb(var(--color-body-50) / <alpha-value>)',
					60: 'rgb(var(--color-body-60) / <alpha-value>)',
					70: 'rgb(var(--color-body-70) / <alpha-value>)',
					80: 'rgb(var(--color-body-80) / <alpha-value>)',
					90: 'rgb(var(--color-body-90) / <alpha-value>)',
					100: 'rgb(var(--color-body-100) / <alpha-value>)',
					200: 'rgb(var(--color-body-200) / <alpha-value>)',
					300: 'rgb(var(--color-body-300) / <alpha-value>)',
					400: 'rgb(var(--color-body-400) / <alpha-value>)',
					500: 'rgb(var(--color-body-500) / <alpha-value>)',
					600: 'rgb(var(--color-body-600) / <alpha-value>)',
					700: 'rgb(var(--color-body-700) / <alpha-value>)',
					800: 'rgb(var(--color-body-800) / <alpha-value>)',
					900: 'rgb(var(--color-body-900) / <alpha-value>)',
				},
			},
		}
	},
	plugins: [
		plugin(function({ addVariant }) {
			addVariant('hover-and-clickable', '&:hover.cursor-pointer',)
		})
	],
}
