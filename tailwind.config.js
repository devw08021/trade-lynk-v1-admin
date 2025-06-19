/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          gray: {
            750: '#374357',
            850: '#1a202e',
            950: '#0d1117',
          },
          bull: {
            50: '#f0fdf4',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
            900: '#064e3b',
          },
          bear: {
            50: '#fef2f2',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            900: '#7f1d1d',
          },
          primary: {
            50: '#eff6ff',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            900: '#1e3a8a',
          },
        },
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
          'grid-pattern': 'url("data:image/svg+xml,%3csvg width="40" height="40" xmlns="http://www.w3.org/2000/svg"%3e%3cdefs%3e%3cpattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"%3e%3cpath d="M 40 0 L 0 0 0 40" fill="none" stroke="%23374151" stroke-width="1" opacity="0.1"/%3e%3c/pattern%3e%3c/defs%3e%3crect width="100%25" height="100%25" fill="url(%23grid)"/%3e%3c/svg%3e")',
        },
        boxShadow: {
          'professional': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
          'glow-green': '0 0 20px rgba(16, 185, 129, 0.3)',
          'glow-red': '0 0 20px rgba(239, 68, 68, 0.3)',
        },
        animation: {
          'fade-in-up': 'fadeInUp 0.5s ease-out',
          'slide-in-right': 'slideInRight 0.3s ease-out',
          'pulse-slow': 'pulse 3s infinite',
          'glow': 'glow 2s ease-in-out infinite alternate',
        },
        keyframes: {
          fadeInUp: {
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          slideInRight: {
            '0%': { opacity: '0', transform: 'translateX(-10px)' },
            '100%': { opacity: '1', transform: 'translateX(0)' },
          },
          glow: {
            '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
            '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' },
          },
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
          mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
          display: ['Inter', 'system-ui', 'sans-serif'],
        },
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
    ],
  }
  