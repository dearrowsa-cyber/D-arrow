import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // D Arrow Brand Colors - Official Guidelines (sRGB IEC61966-2.1)
        // Primary Colors
        'brand-pink': '#FF4D6D',
        'brand-orange': '#FF9A3C',
        'brand-gradient-mid': '#FF6F4F',
        // Background Colors
        'dark-navy': '#0B0D1F',
        'secondary-dark': '#14162E',
        // Neutral Colors
        'brand-white': '#FFFFFF',
        'light-bg': '#F9FAFB',
        'light-bg-secondary': '#F3F4F6',
        'text-dark': '#1F2937',
        'text-light': '#6B7280',
        'soft-white': '#E6E6EA',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #FF4D6D 0%, #FF6F4F 50%, #FF9A3C 100%)',
      },
      fontFamily: {
        // Brand Typography - Local Font Files
        'gilroy': ['Gilroy', 'system-ui', 'sans-serif'],
        'tt-hoves': ['TT Hoves Pro', 'system-ui', 'sans-serif'],
        'bukra': ['29LT-Bukra', 'system-ui', 'sans-serif'],
        'bukra-only': ['29LT-Bukra-Only', 'system-ui', 'sans-serif'],
        'swissra': ['Swissra', 'system-ui', 'sans-serif'],
        // Fallbacks for semantic use
        'sans': ['TT Hoves Pro', 'system-ui', 'sans-serif'],
        'arabic': ['29LT-Bukra', 'system-ui', 'sans-serif'],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '96px',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
      },
      boxShadow: {
        'brand': '0 10px 30px rgba(255, 77, 109, 0.2)',
        'brand-lg': '0 20px 40px rgba(255, 77, 109, 0.3)',
        'brand-xl': '0 30px 60px rgba(255, 77, 109, 0.4)',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '300ms',
        'slow': '500ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
      },
    },
  },
  plugins: [],
}
export default config
