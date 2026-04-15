import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#050816",
        panel: "rgba(11, 18, 38, 0.72)",
        cyanGlow: "#2dd4ff",
        violetGlow: "#8b5cf6",
        mintGlow: "#49f2b4"
      },
      boxShadow: {
        glow: "0 0 42px rgba(45, 212, 255, 0.18)",
        violet: "0 0 38px rgba(139, 92, 246, 0.20)"
      },
      backgroundImage: {
        "radial-grid":
          "radial-gradient(circle at 20% 15%, rgba(45, 212, 255, 0.15), transparent 28%), radial-gradient(circle at 82% 22%, rgba(139, 92, 246, 0.16), transparent 26%), linear-gradient(180deg, #050816 0%, #081122 48%, #050816 100%)"
      }
    }
  },
  plugins: []
};

export default config;
