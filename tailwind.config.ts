import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        hvac: { blue: "#1e6fd9", red: "#d9381e", dark: "#0f172a" },
      },
    },
  },
  plugins: [],
};

export default config;
