/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          base: "#0d0e12",
          surface: "#15171e",
          card: "#1b1d26",
          border: "#292c35",
          borderHover: "#3b3f4d",
        },
      },
    },
  },
  plugins: [],
};
