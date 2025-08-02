import type { Config } from "tailwindcss";

const config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        'grid-pattern': 'radial-gradient(circle, #000 1px, transparent 1px)',
        'brand-gradient': 'linear-gradient(135deg, hsl(var(--bg-gradient-start)), hsl(var(--bg-gradient-end)))',
        'brand-primary-gradient': 'linear-gradient(135deg, hsl(var(--brand-primary)), hsl(var(--brand-accent)))',
        'brand-secondary-gradient': 'linear-gradient(135deg, hsl(var(--brand-secondary)), hsl(var(--brand-primary)))',
        'red-black-gradient': 'linear-gradient(135deg, hsl(0 84% 50%), hsl(0 0% 10%))',
        'black-red-gradient': 'linear-gradient(135deg, hsl(0 0% 5%), hsl(0 84% 40%))',
      },
      backgroundSize: {
        'dot-grid': '40px 40px',
        'dot-pattern': '30px 30px',
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '12px',
        'glass-heavy': '20px',
      },
      colors: {
        // Brand colors
        brand: {
          primary: "hsl(var(--brand-primary))",
          'primary-foreground': "hsl(var(--brand-primary-foreground))",
          secondary: "hsl(var(--brand-secondary))",
          'secondary-foreground': "hsl(var(--brand-secondary-foreground))",
          accent: "hsl(var(--brand-accent))",
          'accent-foreground': "hsl(var(--brand-accent-foreground))",
        },
        // Glass colors
        glass: {
          bg: "hsl(var(--glass-bg))",
          border: "hsl(var(--glass-border))",
          shadow: "hsl(var(--glass-shadow))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), 
    require("@tailwindcss/typography"),
    function({ addUtilities }) {
      const newUtilities = {
        '.glass': {
          'background': 'hsl(var(--glass-bg))',
          'backdrop-filter': 'var(--glass-backdrop)',
          '-webkit-backdrop-filter': 'var(--glass-backdrop)',
          'border': '2px solid hsl(var(--glass-border))',
          'box-shadow': '0 8px 32px hsl(var(--glass-shadow)), inset 0 1px 0 hsl(0 0% 100% / 0.2)',
          'position': 'relative',
        },
        '.glass-light': {
          'background': 'hsl(var(--glass-bg))',
          'backdrop-filter': 'blur(12px)',
          '-webkit-backdrop-filter': 'blur(12px)',
          'border': '2px solid hsl(var(--glass-border))',
          'box-shadow': '0 8px 24px hsl(var(--glass-shadow)), inset 0 1px 0 hsl(0 0% 100% / 0.15)',
          'position': 'relative',
        },
        '.glass-heavy': {
          'background': 'hsl(var(--glass-bg))',
          'backdrop-filter': 'blur(24px)',
          '-webkit-backdrop-filter': 'blur(24px)',
          'border': '3px solid hsl(var(--glass-border))',
          'box-shadow': '0 16px 64px hsl(var(--glass-shadow)), inset 0 2px 0 hsl(0 0% 100% / 0.25)',
          'position': 'relative',
        },
        '.hover-lift': {
          'transition': 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.hover-lift:hover': {
          'transform': 'translateY(-4px) scale(1.02)',
          'box-shadow': '0 20px 40px hsl(var(--glass-shadow)), 0 0 20px hsl(var(--brand-primary) / 0.3)',
        },
        // Premium Glass Variants
        '.glass-ultra': {
          'background': 'rgba(255, 255, 255, 0.03)',
          'backdrop-filter': 'blur(32px) saturate(200%)',
          '-webkit-backdrop-filter': 'blur(32px) saturate(200%)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
          'box-shadow': '0 24px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(220, 38, 38, 0.05)',
          'position': 'relative',
        },
        '.glass-card': {
          'background': 'rgba(0, 0, 0, 0.3)',
          'backdrop-filter': 'blur(16px) saturate(150%)',
          '-webkit-backdrop-filter': 'blur(16px) saturate(150%)',
          'border': '1px solid rgba(255, 255, 255, 0.15)',
          'box-shadow': '0 12px 48px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          'position': 'relative',
        },
        '.glass-button': {
          'background': 'rgba(220, 38, 38, 0.1)',
          'backdrop-filter': 'blur(8px)',
          '-webkit-backdrop-filter': 'blur(8px)',
          'border': '1px solid rgba(220, 38, 38, 0.3)',
          'box-shadow': '0 4px 16px rgba(220, 38, 38, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          'position': 'relative',
        },
        // Premium Shadow System
        '.shadow-glow': {
          'box-shadow': '0 0 20px rgba(220, 38, 38, 0.3), 0 4px 16px rgba(0, 0, 0, 0.1)',
        },
        '.shadow-glow-lg': {
          'box-shadow': '0 0 40px rgba(220, 38, 38, 0.4), 0 8px 32px rgba(0, 0, 0, 0.15)',
        },
        '.shadow-depth': {
          'box-shadow': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24), 0 4px 8px rgba(220, 38, 38, 0.1)',
        },
        '.shadow-depth-lg': {
          'box-shadow': '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06), 0 8px 16px rgba(220, 38, 38, 0.15)',
        },
        '.shadow-depth-xl': {
          'box-shadow': '0 8px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1), 0 16px 32px rgba(220, 38, 38, 0.2)',
        },
        '.shadow-inner-glow': {
          'box-shadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.1), 0 0 20px rgba(220, 38, 38, 0.1)',
        },
        // Interactive Effects
        '.magnetic': {
          'transition': 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.2s ease',
        },
        '.magnetic:hover': {
          'transform': 'translateY(-2px) scale(1.02)',
          'box-shadow': '0 8px 25px rgba(0, 0, 0, 0.15), 0 0 20px rgba(220, 38, 38, 0.2)',
        },
        '.float': {
          'animation': 'float 6s ease-in-out infinite',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      }
      addUtilities(newUtilities)
    }
  ],
} satisfies Config

export default config