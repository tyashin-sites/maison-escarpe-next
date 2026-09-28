import type { Config } from 'tailwindcss';

/**
 * Tailwind tokens → CSS variables in globals.css (raw HSL triples, so
 * `<alpha-value>` works everywhere — tyashin-platform CLAUDE.md §5).
 *
 * The scaffold's legacy semantic names (cream/blush/sage/rose/plum/gold) are
 * kept and RE-VALUED to the Maison Escarpe palette so the ported transactional
 * pages (cart, checkout, forms) restyle without class churn:
 *   cream → paper-deep · blush → stone tint on paper · sage → brass (action)
 *   rose → brass-soft · rose-deep → brass · plum → stone · gold → brass
 */
const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: { '2xl': '1280px' },
    },
    extend: {
      fontFamily: {
        // Addendum §13: heading/body resolve to the brand-kit font variables.
        heading: ['var(--brand-heading-font)'],
        body: ['var(--brand-body-font)'],
        display: ['var(--brand-heading-font)'],
      },
      colors: {
        // Addendum §13 required mappings → the platform --brand-* variables.
        border: 'var(--brand-border)',
        surface: 'var(--brand-surface)',
        'primary-contrast': 'var(--brand-primary-contrast)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        background: 'var(--brand-bg)',
        foreground: 'var(--brand-text)',
        primary: {
          DEFAULT: 'var(--brand-primary)',
          deep: 'var(--brand-primary-deep)',
          foreground: 'var(--brand-primary-contrast)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'var(--brand-text-muted)',
          foreground: 'var(--brand-text-muted)',
        },
        accent: {
          DEFAULT: 'var(--brand-accent)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
        // Maison Escarpe palette (DESIGN-SPEC)
        ink: {
          DEFAULT: 'hsl(var(--ink) / <alpha-value>)',
          deep: 'hsl(var(--ink-deep) / <alpha-value>)',
        },
        stone: {
          DEFAULT: 'hsl(var(--stone) / <alpha-value>)',
          light: 'hsl(var(--stone-light) / <alpha-value>)',
        },
        paper: {
          DEFAULT: 'hsl(var(--paper) / <alpha-value>)',
          deep: 'hsl(var(--paper-deep) / <alpha-value>)',
        },
        brass: {
          DEFAULT: 'hsl(var(--brass) / <alpha-value>)',
          soft: 'hsl(var(--brass-soft) / <alpha-value>)',
          deep: 'hsl(var(--brass-deep) / <alpha-value>)',
        },
        garnet: 'hsl(var(--garnet) / <alpha-value>)',
        'muted-dark': 'hsl(var(--muted-dark) / <alpha-value>)',
        // Legacy scaffold names, re-valued (see header comment)
        gold: {
          DEFAULT: 'hsl(var(--brass) / <alpha-value>)',
          light: 'hsl(var(--brass-soft) / <alpha-value>)',
        },
        blush: 'hsl(var(--paper-deep) / <alpha-value>)',
        sage: 'hsl(var(--brass) / <alpha-value>)',
        cream: 'hsl(var(--paper-deep) / <alpha-value>)',
        rose: {
          DEFAULT: 'hsl(var(--brass-soft) / <alpha-value>)',
          deep: 'hsl(var(--brass) / <alpha-value>)',
        },
        plum: 'hsl(var(--stone) / <alpha-value>)',
      },
      borderRadius: {
        sm: 'var(--brand-radius-sm)',
        md: 'var(--brand-radius-md)',
        lg: 'var(--brand-radius-lg)',
        full: 'var(--brand-radius-full)',
      },
      boxShadow: {
        rest: 'var(--shadow-rest)',
        hover: 'var(--shadow-hover)',
      },
      transitionTimingFunction: {
        brand: 'var(--ease-brand)',
      },
    },
  },
  plugins: [],
};

export default config;
