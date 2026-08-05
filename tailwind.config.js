/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				// Warm paper editorial palette. Every value is a literal, so the
				// config can never reference a CSS variable that does not exist.
				paper: {
					DEFAULT: '#FAF8F4',
					raised: '#FFFDFA',
					sunk: '#F3EFE7',
				},
				ink: {
					// Three steps, each measured against paper (#FAF8F4):
					// 17.5:1, 9.1:1, 5.0:1. `faint` was #7D746A (4.32:1), which
					// failed the 4.5:1 floor for the abstract and author lines.
					DEFAULT: '#16130F',
					muted: '#4A443C',
					faint: '#736A5F',
				},
				rule: {
					DEFAULT: '#E3DDD2',
					strong: '#CFC6B7',
				},
				accent: {
					DEFAULT: '#8A3324',
					hover: '#6E2819',
					wash: '#F4EAE5',
				},
			},
			fontFamily: {
				display: ['"Fraunces Variable"', 'Fraunces', 'Georgia', 'serif'],
				text: ['"Instrument Sans Variable"', 'Instrument Sans', 'system-ui', 'sans-serif'],
				// Neither Fraunces nor Instrument Sans ships CJK, so Chinese needs an
				// explicit stack rather than whatever the platform falls back to.
				// Sans-first to match Instrument Sans; a serif CJK next to a
				// grotesque Latin reads as two unrelated typefaces.
				cjk: [
					'"PingFang SC"',
					'"Hiragino Sans GB"',
					'"Source Han Sans SC"',
					'"Noto Sans CJK SC"',
					'"Microsoft YaHei"',
					'sans-serif',
				],
			},
			fontSize: {
				'display-xl': ['clamp(3.25rem, 11vw, 6rem)', { lineHeight: '0.92', letterSpacing: '-0.03em' }],
				'display-md': ['clamp(1.875rem, 4.5vw, 2.5rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
				'title': ['1.375rem', { lineHeight: '1.32', letterSpacing: '-0.012em' }],
				'body': ['1.0625rem', { lineHeight: '1.75' }],
				'micro': ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0.06em' }],
			},
			maxWidth: {
				measure: '68ch', // body measure, inside the 65-75ch band
				page: '72rem',
			},
			spacing: {
				section: 'clamp(3.25rem, 6vw, 5.5rem)',
			},
			transitionTimingFunction: {
				// Exponential ease-out: quick departure, long settle.
				out: 'cubic-bezier(0.16, 1, 0.3, 1)',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}
