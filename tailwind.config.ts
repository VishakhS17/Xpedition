import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          red: "#fd0100",
          "red-dark": "#d00100", // Darker shade for hover states
          black: "#000000",
          white: "#FFFFFF",
          dark: "#1A1A1A",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-orbitron)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

