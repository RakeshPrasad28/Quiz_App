/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-purple': '#af9cf3',
        'custom-option-background':'#f3f4fa',
        'custom-correct-background':'#def2bf',
        'custom-incorrect-background':'#f2bfbf',
        'bg-custom-not-attended-background':'#f5f5f5',
        'button-color':'#ff3b40'
      },
      screens:{
        'iphone14': '430px',
      }
    },
  },
  plugins: [],
}



