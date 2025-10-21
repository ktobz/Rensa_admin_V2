import plugin from 'tailwindcss/plugin';

export const shadcnPlugin = plugin(
	// CSS variable definitions
	function ({ addBase, addComponents }) {
		addBase({
			':root': {
				'--background': '216 19% 95%',
				'--foreground': '120 1% 14%',
				'--card': '0 0% 100%',
				'--card-foreground': '222.2 84% 4.9%',
				'--popover': '0 0% 100%',
				'--popover-foreground': '222.2 84% 4.9%',
				'--primary': '224 62% 45%',
				'--primary-dark': '173 96%, 9%',
				'--primary-foreground': '0 0% 100%',
				'--secondary': '43 100% 66%',
				'--secondary-foreground': '120 1% 14%',
				'--tertiary': '174 96% 18%',
				'--light-grey': '203 13% 88%',
				'--muted': '210 40% 96.1%',
				'--muted-foreground': '215.4 16.3% 46.9%',
				'--accent': '210 40% 96.1%',
				'--accent-foreground': '222.2 47.4% 11.2%',
				'--destructive': '0 100% 64%',
				'--destructive-foreground': '0 100% 96%',
				'--border': '120 1% 14%',
				'--input': '0 0% 85%',
				'--ring': '174 96% 18%',

				'--label': '0 0 38%',
				'--disabled-bg': '0 0 96%',

				'--radius': '20px',
				'--spacing': '2px',
				'--heading': '50px',

				// BLACKS
				'--black-800': '120 1% 14%',

				// GREYS
				'--grey-200': '#929393',
				'--grey-600': '#626262',
			},
			'.dark': {
				'--background': '222.2 84% 4.9%',
				'--foreground': '210 40% 98%',
				'--card': '222.2 84% 4.9%',
				'--card-foreground': '210 40% 98%',
				'--popover': '222.2 84% 4.9%',
				'--popover-foreground': '210 40% 98%',
				'--primary': '210 40% 98%',
				'--primary-foreground': '222.2 47.4% 11.2%',
				'--secondary': '217.2 32.6% 17.5%',
				'--secondary-foreground': '210 40% 98%',
				'--muted': '217.2 32.6% 17.5%',
				'--muted-foreground': '215 20.2% 65.1%',
				'--accent': '217.2 32.6% 17.5%',
				'--accent-foreground': '210 40% 98%',
				'--destructive': '0 62.8% 30.6%',
				'--destructive-foreground': '210 40% 98%',
				'--border': '217.2 32.6% 17.5%',
				'--input': '217.2 32.6% 17.5%',
				'--ring': '212.7 26.8% 83.9%',
			},
		});

		addBase({
			'*': {
				boxSizing: 'border-box',
				'@apply border-border': {},
				padding: '0',
				margin: '0',
				borderColor: 'unset',
			},
			input: {
				margin: '0px',
			},
			html: { fontSize: '16px' },
			p: { fontSize: '1rem', letterSpacing: '0.01em' },
			'.container': {
				width: '100%',
				marginRight: 'auto',
				marginLeft: 'auto',
				paddingRight: '2rem ',
				paddingLeft: '2rem ',
			},

			'.lp-container': {
				width: '100%',
				marginRight: 'auto',
				marginLeft: 'auto',
				paddingRight: '2rem ',
				paddingLeft: '2rem ',
			},

			'@media (min-width: 1400px)': {
				'.container': { maxWidth: '1400px' },
				'.gc-container': { maxWidth: '1400px' },
			},
			'@media (max-width: 396px)': {
				'.container': { padding: '0 20px 0 20px' },
				'.gc-container': { padding: '0 20px 0 20px' },
			},
		});

		addComponents({
			'.flex-center': {
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			},

			'.p-text-12': {
				fontFamily: 'var(--font-inter-regular)',
				fontSize: '12px',
				fontWeight: 'normal',
				lineHeight: '130%',
				color: '#232423',
				letterSpacing: '0.12px',
			},
		});
	},

	//   Extend tailwind theme
	{
		theme: {
			container: {
				center: true,
				padding: '2rem',
				screens: {
					'2xl': '1400px',
				},
			},
			extend: {
				fontFamily: {
					bricolage: ["'BricolageVariable'", 'sans-serif'],
					interRegular: ['InterRegular'],
					interSemiBold: ['InterSemiBold'],
					interBold: ['InterBold'],
					bBold: ['BricolageBold'],
				},

				fontSize: {
					heading: 'var(--heading)',
				},

				backgroundImage: {},

				margin: {
					sectionLg: '120px',
					sectionSm: '70px',
					m10: '10px',
					m20: '20px',
					m30: '30px',
					m40: '40px',
				},

				colors: {
					border: 'hsl(var(--border))',
					input: 'hsl(var(--input))',
					ring: 'hsl(var(--ring))',
					background: 'hsl(var(--background))',
					foreground: 'hsl(var(--foreground))',
					gray: 'hsl(var(--light-grey))',
					label: 'hsl(var(--label))',
					'disabled-bg': 'hsl(var(--disabled-bg))',
					primary: {
						DEFAULT: 'hsl(var(--primary-dark))',
						foreground: 'hsl(var(--primary-foreground))',
						faded: '#26c3a728',
						primary500: 'hsl(var(--primary))',
					},
					tertiary: {
						DEFAULT: 'hsl(var(--tertiary))',
						foreground: 'hsl(var(--tertiary))',
					},
					secondary: {
						DEFAULT: 'hsl(var(--secondary))',
						foreground: 'hsl(var(--secondary-foreground))',
					},
					destructive: {
						DEFAULT: 'hsl(var(--destructive))',
						// foreground: 'hsl(var(--destructive-foreground))',
						foreground: '#FFECEC',
					},
					muted: {
						DEFAULT: 'hsl(var(--muted))',
						foreground: 'hsl(var(--muted-foreground))',
					},
					accent: {
						DEFAULT: 'hsl(var(--accent))',
						foreground: 'hsl(var(--accent-foreground))',
					},
					popover: {
						DEFAULT: 'hsl(var(--popover))',
						foreground: 'hsl(var(--popover-foreground))',
					},
					card: {
						DEFAULT: 'hsl(var(--card))',
						foreground: 'hsl(var(--card-foreground))',
					},
					black: {
						800: 'var(--black-800)',
					},
					grey: {
						200: 'var(--grey-200)',
						600: 'var(--grey-600)',
					},
				},
				borderRadius: {
					lg: 'var(--radius)',
					md: 'calc(var(--radius) - 2px)',
					sm: 'calc(var(--radius) - 4px)',
				},
				keyframes: {
					'accordion-down': {
						from: { height: '0' },
						to: { height: 'var(--radix-accordion-content-height)' },
					},
					'accordion-up': {
						from: { height: 'var(--radix-accordion-content-height)' },
						to: { height: '0' },
					},
					'caret-blink': {
						'0%,70%,100%': { opacity: '1' },
						'20%,50%': { opacity: '0' },
					},
					'slide-out-to-top': {
						'0%': { transform: 'translateY(0)' },
						'100%': { transform: 'translateY(-48%)' },
					},
					'slide-in-from-top': {
						'0%': { transform: 'translateY(-48%)' },
						'100%': { transform: 'translateY(0%)' },
					},
					bounce: {
						'0%, 100%': {
							transform: 'translateX(-25%)',
							animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
						},
						'50%': {
							transform: 'translateX(0)',
							animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
						},
					},
				},
				animation: {
					'accordion-down': 'accordion-down 0.2s ease-out',
					'accordion-up': 'accordion-up 0.2s ease-out',
					'caret-blink': 'caret-blink 1.25s ease-out infinite',
					'slide-out-to-top': 'slide-out-to-top 0.5s ease-in-out',
					'animate-bounce': 'bounce 1s infinite',
				},
			},
		},
	}
);
