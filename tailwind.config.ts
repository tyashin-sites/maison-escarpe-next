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
        display: ['var(--font-display)', 'Bodoni Moda', 'Didot', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'Manrope', 'Helvetica Neue', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
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
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
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
        ink: 'hsl(var(--ink) / <alpha-value>)',
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
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
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
