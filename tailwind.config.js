/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '4.5': '1.125rem', // 18px
        '7': '1.75rem',    // 28px
        '11': '2.75rem',   // 44px
      }
    },
  },
  plugins: [],
}

