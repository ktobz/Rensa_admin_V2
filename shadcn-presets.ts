import type { Config } from 'tailwindcss';
import animatePlugin from 'tailwindcss-animate';
import { shadcnPlugin } from './shadcn-plugin';

export const shadcnPreset = {
	// important: true,
	content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
	// darkMode: ['class', ''],
	darkMode: false,

	// content: [],
	plugins: [animatePlugin, shadcnPlugin],
} satisfies Config;
