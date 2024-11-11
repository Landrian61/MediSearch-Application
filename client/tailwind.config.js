/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        claude: {
          50: "#f5f7ff",
          100: "#ebeeff",
          200: "#dbe0ff",
          300: "#bcc3ff",
          400: "#9195ff",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81"
        },
        gray: {
          850: "#1e1f23",
          950: "#0c0c0d"
        }
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
