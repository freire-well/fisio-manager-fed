/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'app-bg': '#0c1220',
        'app-surface': '#1e293b',
        'app-primary': '#0ea5e9',
        'app-text': '#f0f9ff',
        'app-border': '#334155',
      },
    },
  },
  plugins: [],
};