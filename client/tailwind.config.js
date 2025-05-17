/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // Asegúrate de que esto incluya tus archivos de componentes
    ],
    theme: {
      extend: {
        animation: {
          'fade-in': 'fadeIn 0.5s ease-in-out',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 },
          },
        },
      },
    },
    plugins: [],
  }
  