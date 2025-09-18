import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
        '3xl': '1600px',
      },
    },
    extend: {
      padding: {
        'container-xl': '7.5rem',
        'container-lg': '5rem',
        'container-md': '3.5rem',
        'container-base': '1.5rem',
      },
      colors: {
        text: {
          DEFAULT: 'var(--text)',
          dim: 'var(--text-dim)',
          danger: '#DC2626',
        },
        primary: {
          '1': '#0F172A',
          '2': '#0F172A',
          '3': '#FBFBFC',
          '4': '#F4F6F7',
          '5': '#EFF1F4',
          '6': '#D7E7FF',
          '7': '#F4EEFF',
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          '1': '#F6F6F93D',
          '2': '#F6F6F93D',
          '3': '#009644',
          '4': '#F14336',
          '5': '#FF3E1D1A',
          '6': '#F1F5F9',
          '7': '#E2E8F0',
          '8': '#83838B',
          '9': '#AD00FF',
          '10': '#FFF2FF',
          '11': '#FBE4FF',
          DEFAULT: 'var(--secondary)',
        },
      },
      backgroundColor: {
        background: '#fff',
        'background-lighter': '#f1f5f9',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'collapsible-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-collapsible-content-height)',
          },
        },
        'collapsible-up': {
          from: {
            height: 'var(--radix-collapsible-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'pulse-loader': {
          '0%': {
            opacity: '0',
          },
          '50%': {
            transform: 'scale(1.4)',
            opacity: '0.4',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.2s ease-out',
        'collapsible-up': 'collapsible-up 0.2s ease-out',
        'pulse-loader': 'pulse-loader 1000ms cubic-bezier(0.9, 0.7, 0.5, 0.9) infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    function ({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        '.gradient-text': {
          'background-image': 'linear-gradient(270deg, #696CFF 0%, #E43CFF 100%)',
          color: 'transparent',
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          display: 'inline-block',
        },
        '.gradient-bg': {
          background: 'linear-gradient(270deg, #696CFF 0%, #E43CFF 100%)',
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
export default config;
