import type { Config } from 'tailwindcss'

const config: Config = {
  // Correction des chemins : suppression de /src pour scanner vos vrais dossiers
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './store/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          poudre: '#F2C4BC',
          light: '#F9E8E5',
          medium: '#E8A99F',
          dark: '#C4786E',
          hero: '#D4907E',
        },
        gold: {
          light: '#E8D5A3',
          DEFAULT: '#C9A96E',
          dark: '#A8843A',
        },
        cream: '#FDF8F6',
        maisssty: {
          bg: '#FDF6F3',
          card: '#FFF9F7',
          border: '#F0DDD8',
          text: '#2C1810',
          muted: '#8B6860',
        }
      },
      fontFamily: {
        playfair: ['Playfair Display', 'Georgia', 'serif'],
        cormorant: ['Cormorant Garamond', 'Georgia', 'serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-rose': 'linear-gradient(135deg, #FDF6F3 0%, #F9E8E5 50%, #F2C4BC 100%)',
        'gradient-gold': 'linear-gradient(135deg, #E8D5A3 0%, #C9A96E 100%)',
      },
      boxShadow: {
        'rose': '0 4px 20px rgba(194, 120, 110, 0.15)',
        'rose-lg': '0 8px 40px rgba(194, 120, 110, 0.25)',
        'card': '0 2px 16px rgba(44, 24, 16, 0.08)',
        'card-hover': '0 8px 32px rgba(44, 24, 16, 0.15)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config