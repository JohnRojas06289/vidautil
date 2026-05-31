import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        vu: {
          bg: "#04342C",
          bgAlt: "#085041",
          accent: "#1D9E75",
          accentLight: "#5DCAA5",
          textPrimary: "#E1F5EE",
          textSecondary: "#9FE1CB",
          warning: "#EF9F27",
          warningLight: "#FAC775",
          medalBronze: "#A0522D",
          medalSilver: "#B4B2A9",
          medalGold: "#D4AF37",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
