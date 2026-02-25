import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6366F1',
          secondary: '#22C55E',
          danger: '#EF4444',
          bg: '#0F172A',
          card: '#111827',
          text: '#E5E7EB'
        }
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.2)',
        glass: '0 8px 24px rgba(99, 102, 241, 0.15)'
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top left, rgba(99,102,241,0.25), rgba(15,23,42,0.9))'
      }
    }
  },
  plugins: []
};

export default config;
