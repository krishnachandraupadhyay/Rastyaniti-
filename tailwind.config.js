/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#ff7722',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          DEFAULT: '#ff671f',
        },
        navy: {
          800: '#0b1e36',
          900: '#071324',
          950: '#040b15',
        },
        tiranga: {
          saffron: '#FF671F',
          white: '#FFFFFF',
          green: '#046A38',
          blue: '#06038D',
          gold: '#D4AF37'
        }
      },
      fontFamily: {
        hindi: ['"Tiro Devanagari Hindi"', '"Rozha One"', 'system-ui', 'sans-serif'],
        display: ['"Yatra One"', '"Cinzel"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 2s infinite',
      }
    },
  },
  plugins: [],
}
