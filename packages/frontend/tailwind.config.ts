import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './content/**/*.md',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF6EE',
          200: '#F5EDDD',
          300: '#EDE0C7',
        },
        charcoal: {
          700: '#3A3A3A',
          800: '#2C2C2C',
          900: '#1A1A1A',
        },
        gallery: {
          gold: '#B8860B',
          bronze: '#8B6914',
          sage: '#6B7F5E',
          wine: '#722F37',
          navy: '#2C3E6B',
        },
      },
      fontFamily: {
        display: ['Caveat', 'cursive'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        gallery: '1400px',
      },
    },
  },
  plugins: [],
} satisfies Config
