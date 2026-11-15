/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'estedadv', 'estedad', 'system-ui', 'sans-serif'],
        fa: ['estedadv', 'estedad', 'sans-serif'],
        estedad: ['estedadv', 'estedad', 'sans-serif'],
        vazir: ['estedadv', 'estedad', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border, 214 32% 91%))",
        background: "hsl(var(--background, 0 0% 100%))",
        foreground: "hsl(var(--foreground, 222 47% 11%))",
      }
    },
  },
  plugins: [],
}
