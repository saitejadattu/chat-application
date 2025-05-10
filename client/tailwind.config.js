// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      receiver: {
        color: "#202c33",
      },
      sender: {
        color: "#005c4b",
      },
    },
  },
  plugins: [],
};
