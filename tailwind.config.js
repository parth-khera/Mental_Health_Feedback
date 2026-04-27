/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#00E5E5',
          dark:    '#00CCCC',
          glow:    'rgba(0,229,229,0.25)',
        },
        brand: {
          blue:    '#0076A3',
          mid:     '#006385',
          deep:    '#004A6B',
          slate:   '#0D1B2A',
          grey:    '#4A6070',
          silver:  '#E0E6EE',
          bg:      '#F5F4F0',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'gradient-header':  'linear-gradient(135deg, #004F6E 0%, #00E5E5 55%, #0088B8 100%)',
        'gradient-teal':    'linear-gradient(135deg, #00E5E5, #00CCCC)',
        'gradient-blue':    'linear-gradient(145deg, #004A6B 0%, #00E5E5 50%, #007BAA 100%)',
      },
      boxShadow: {
        'soft':    '0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'medium':  '0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'large':   '0 8px 32px rgba(13,27,42,0.09), 0 4px 8px rgba(0,0,0,0.04)',
        'teal':    '0 4px 24px rgba(0,229,229,0.25)',
        'teal-lg': '0 8px 40px rgba(0,229,229,0.30)',
        'blue':    '0 4px 24px rgba(0,76,111,0.20)',
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
