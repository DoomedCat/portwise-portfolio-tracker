
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: '#121212',
				foreground: '#FFFFFF',
				primary: {
					DEFAULT: '#7E3FF2',
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: '#1E1E1E',
					foreground: '#FFFFFF'
				},
				destructive: {
					DEFAULT: '#FF4444',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#2A2A2A',
					foreground: '#A0A0A0'
				},
				accent: {
					DEFAULT: '#7E3FF2',
					foreground: '#FFFFFF',
					light: '#9F66FF'
				},
				popover: {
					DEFAULT: '#1E1E1E',
					foreground: '#FFFFFF'
				},
				card: {
					DEFAULT: '#1E1E1E',
					foreground: '#FFFFFF'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				xl: '12px'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
