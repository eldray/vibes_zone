/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        vibe: {
          pink: "#FF6B95",
          orange: "#FF8E53",
          peach: "#FF9A8B",
        },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        "glow-pink": "0 0 15px rgba(255, 105, 149, 0.5)",
      },
    },
  },
  plugins: [],
};
