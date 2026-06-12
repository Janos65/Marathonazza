/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        green: {
          50: '#F0FAF3',
          100: '#D8F3DC',
          400: '#74C69D',
          600: '#40916C',
          700: '#2D6A4F',
          800: '#1B4332',
          900: '#0D2B1D',
        },
        cream: '#F8FAF5',
        ink: '#1C2B1A',
        gold: { DEFAULT: '#C9A84C', light: '#F0D98A' },
        silver: '#A8B5A0',
        bronze: '#C17F3A',
        birdie: '#2D9E5A',
        eagle: '#1A6B3A',
        bogey: '#E8A050',
        double: '#D4604A',
        error: '#C0392B',
        success: '#27AE60',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        page: '1280px',
      },
    },
  },
  plugins: [],
}
