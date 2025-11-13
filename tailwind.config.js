/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00f0ff',
          purple: '#bf00ff',
          pink: '#ff006e',
        },
      },
      boxShadow: {
        'neon-blue': '0 0 10px #00f0ff, 0 0 20px #00f0ff, 0 0 30px #00f0ff',
        'neon-purple': '0 0 10px #bf00ff, 0 0 20px #bf00ff, 0 0 30px #bf00ff',
        'neon-pink': '0 0 10px #ff006e, 0 0 20px #ff006e, 0 0 30px #ff006e',
      },
    },
  },
  plugins: [],
}
