import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wine: "var(--color-wine)",
        "wine-light": "var(--color-wine-light)",
        "wine-muted": "var(--color-wine-muted)",
        cream: "var(--color-cream)",
        charcoal: "var(--color-charcoal)",
        stone: "var(--color-stone)",
        gold: "var(--color-gold)",
        divider: "var(--color-divider)",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
        heading: ["var(--font-cormorant)", "serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      spacing: {
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        "3xl": "var(--space-3xl)",
        "4xl": "var(--space-4xl)",
      },
    },
  },
  plugins: [],
};
export default config;
