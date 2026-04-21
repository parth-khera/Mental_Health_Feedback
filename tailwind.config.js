/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50:  '#f2f7f2',
          100: '#e0ece0',
          200: '#c0d9c0',
          300: '#8fbe8f',
          400: '#6aab7a',
          500: '#4a7c59',
          600: '#3a6347',
          700: '#2e5039',
          800: '#243f2d',
          900: '#1c3223',
        },
        stone: {
          50: '#fafaf9',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh':   'linear-gradient(135deg, #f2f7f2 0%, #e8f4e8 50%, #f0f7f0 100%)',
      },
      boxShadow: {
        'soft':    '0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'medium':  '0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'large':   '0 8px 32px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.04)',
        'sage':    '0 4px 24px rgba(74,124,89,0.20)',
        'sage-lg': '0 8px 40px rgba(74,124,89,0.28)',
        'inner-sm':'inset 0 1px 3px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up':   { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
      },
    },
  },
  plugins: [],
}
