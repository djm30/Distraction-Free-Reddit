/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        none: "0",
        sm: "2px",
        DEFAULT: "4px",
        md: "0.375rem",
        lg: "0.5rem",
        full: "9999px",
        large: "12px",
      },
      colors: {
        white: "#FFFFFF",
        dark: "#030304",
        cardGrey: "#1A1A1B",
        darkBorder: "#343536",
        darkText: "#818384",
        cardLight: "#272729",
        buttonBlue: "#0079D3",
        lightBorder: "#D9D9D9",
        switchGrey: "#4D4D52",
      },
    },
  },
  plugins: [
    // ...
    require("tailwind-scrollbar"),
  ],
};
