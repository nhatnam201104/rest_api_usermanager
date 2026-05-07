/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        aurora: {
          pink:   '#f472b6',
          purple: '#a855f7',
          blue:   '#3b82f6',
          cyan:   '#06b6d4',
          orange: '#f97316',
        },
      },
      backgroundImage: {
        'aurora-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #fda085 100%)',
        'card-gradient':   'linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
        'mesh-gradient':   'radial-gradient(at 40% 20%, hsla(280,100%,74%,0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0.2) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(340,100%,76%,0.2) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(22,100%,77%,0.2) 0px, transparent 50%)',
      },
      animation: {
        'float':        'float 6s ease-in-out infinite',
        'float-slow':   'float 9s ease-in-out infinite',
        'float-fast':   'float 4s ease-in-out infinite',
        'spin-slow':    'spin 20s linear infinite',
        'pulse-glow':   'pulseGlow 3s ease-in-out infinite',
        'slide-up':     'slideUp 0.6s ease-out forwards',
        'fade-in':      'fadeIn 0.8s ease-out forwards',
        'tilt':         'tilt 10s ease-in-out infinite',
        'gradient-x':   'gradientX 8s ease infinite',
        'bounce-slow':  'bounce 3s ease-in-out infinite',
        'shimmer':      'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%':      { transform: 'translateY(-20px) rotate(2deg)' },
          '66%':      { transform: 'translateY(-10px) rotate(-2deg)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(168,85,247,0.4)' },
          '50%':      { boxShadow: '0 0 60px rgba(168,85,247,0.8), 0 0 100px rgba(236,72,153,0.4)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        tilt: {
          '0%, 100%': { transform: 'rotate(-2deg) scale(1)' },
          '50%':      { transform: 'rotate(2deg) scale(1.02)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glow-purple': '0 0 30px rgba(168,85,247,0.5)',
        'glow-pink':   '0 0 30px rgba(244,114,182,0.5)',
        'glow-blue':   '0 0 30px rgba(59,130,246,0.5)',
        'card-3d':     '0 25px 50px -12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)',
        'inner-glow':  'inset 0 1px 0 rgba(255,255,255,0.2)',
      },
      backdropBlur: {
        xs: '2px',
      },
      perspective: {
        '500':  '500px',
        '1000': '1000px',
        '2000': '2000px',
      },
    },
  },
  plugins: [],
}