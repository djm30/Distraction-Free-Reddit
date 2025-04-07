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
        cardDark: "#181C1F",
        cardGrey: "#333D42",
        cardLight: "#2B3236",
        focusBorder: "#027FAE",
        darkBorder: "#343536",
        importantText: "#EEF1F3",
        // primaryText: "#DBE4E9",
        primaryText: "#B7CAD4",
        secondaryText: "#748791",
        buttonBlue: "#0079D3",
        lightBorder: "#D9D9D9",
        switchGrey: "#4D4D52",
        activeButton: "#115BCA",
        activeButtonHover: "#1870F4",
        inactiveButton: "#2A3236",
        inactiveButtonHover: "#333D42",
      },
    },
  },
  plugins: [
    // ...
    require("tailwind-scrollbar"),
  ],
};
