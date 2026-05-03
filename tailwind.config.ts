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
        brand: {
          50:  "#fdf8f0",
          100: "#faefd9",
          200: "#f5ddb2",
          300: "#edc47c",
          400: "#e4a444",
          500: "#dc8a1e",
          600: "#c46e14",
          700: "#a35312",
          800: "#854217",
          900: "#6e3817",
          950: "#3c1c09",
        },
      },
    },
  },
  plugins: [],
};

export default config;
