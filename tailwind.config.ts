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
        pastel: {
          pink:    "#FFD6E0",
          peach:   "#FFECCC",
          yellow:  "#FFF9C4",
          mint:    "#C8F5E0",
          sky:     "#C8E6FA",
          lavender:"#E8D5FF",
          lilac:   "#F0E6FF",
        },
        stamp: {
          done:    "#FF8FAB",
          miss:    "#E0E0E0",
          bg:      "#FFF5F8",
        }
      },
      fontFamily: {
        round: ["'M PLUS Rounded 1c'", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "3rem",
      },
      keyframes: {
        powa: {
          "0%":   { transform: "scale(0.5)", opacity: "0" },
          "60%":  { transform: "scale(1.2)", opacity: "1" },
          "80%":  { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)",   opacity: "1" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        powa:   "powa 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
        fadeIn: "fadeIn 0.3s ease forwards",
      },
    },
  },
  plugins: [],
};
export default config;
