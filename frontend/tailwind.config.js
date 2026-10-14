/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0F2B5C',
          navyDark: '#0A1C3C',
          navyLight: '#1D4E89',
          saffron: '#FF9933',
          saffronDark: '#D97706',
          saffronLight: '#FEF3C7',
          green: '#138808',
          greenDark: '#0A5C05',
          greenLight: '#D1FAE5',
          gold: '#D4AF37',
          surface: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          textMain: '#0F172A',
          textMuted: '#475569'
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Noto Sans Devanagari',
          'sans-serif'
        ],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(15, 43, 92, 0.08)',
        'glass-hover': '0 14px 40px 0 rgba(15, 43, 92, 0.16)',
        'gov': '0 2px 8px -2px rgba(15, 43, 92, 0.1), 0 1px 4px -1px rgba(15, 43, 92, 0.06)'
      }
    },
  },
  plugins: [],
}
