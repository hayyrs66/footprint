/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			backgroundImage: {
				'hero': "url('/nature-4.jpg')",
			},

			animation: {
				'arrow-animation': 'arrow 2s cubic-bezier(.47,.23,.6,.88) infinite',
				'spin': 'spin 40s linear infinite',
			},
			keyframes: {
				arrow: {
					'0%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-15px)' },
					'100%': { transform: 'translateY(0)' },
				},
			},
			colors: {
				'primary': '#EBFF6D',
				'bg-gray': '#08090A',
			},
		},
	},
	plugins: [],
}
