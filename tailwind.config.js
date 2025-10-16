/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Royal Brown & White Design System
        royal: {
          50: "#faf8f5",
          100: "#f5f0e8",
          200: "#e8ddd0",
          300: "#d6c5b0",
          400: "#c1a88a",
          500: "#a88968",
          600: "#8b6f4f",
          700: "#6d5842",
          800: "#5a4936",
          900: "#4a3d2e",
          950: "#2a2119",
        },
        brown: {
          50: "#f9f7f4",
          100: "#f1ebe3",
          200: "#e3d5c3",
          300: "#d1b89d",
          400: "#ba9774",
          500: "#a67c5a",
          600: "#8d6647",
          700: "#73513b",
          800: "#5f4433",
          900: "#4f3a2c",
          950: "#2b1f17",
        },
        cream: {
          50: "#fdfcfb",
          100: "#faf8f5",
          200: "#f5f0e8",
          300: "#ede5d7",
          400: "#e0d3bf",
          500: "#d1bfa2",
          600: "#bda786",
          700: "#a18b6d",
          800: "#85725b",
          900: "#6d5e4c",
          950: "#3a3128",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-royal":
          "linear-gradient(135deg, #faf8f5 0%, #f5f0e8 50%, #e8ddd0 100%)",
        "gradient-brown":
          "linear-gradient(135deg, #8b6f4f 0%, #6d5842 50%, #5a4936 100%)",
        "gradient-luxury":
          "linear-gradient(to bottom right, #faf8f5, #f5f0e8, #e8ddd0)",
      },
      boxShadow: {
        royal:
          "0 4px 6px -1px rgba(139, 111, 79, 0.1), 0 2px 4px -1px rgba(139, 111, 79, 0.06)",
        "royal-lg":
          "0 10px 15px -3px rgba(139, 111, 79, 0.1), 0 4px 6px -2px rgba(139, 111, 79, 0.05)",
        "royal-xl":
          "0 20px 25px -5px rgba(139, 111, 79, 0.1), 0 10px 10px -5px rgba(139, 111, 79, 0.04)",
        "royal-2xl":
          "0 25px 50px -12px rgba(139, 111, 79, 0.25)",
        "inner-royal": "inset 0 2px 4px 0 rgba(139, 111, 79, 0.06)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
}
