import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", // important so Tailwind scans Remix app files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
