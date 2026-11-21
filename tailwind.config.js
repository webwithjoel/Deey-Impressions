export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        purple: { DEFAULT: '#4B0F55', dark: '#2E0833' },
        gold: { DEFAULT: '#D4A22C', light: '#F0C75A' },
        cream: '#FBF7F0',
        charcoal: '#231A26',
        whatsapp: '#25D366',
        soft: '#E9DFEA',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['Poppins', 'sans-serif'],
      },
      borderRadius: { card: '16px' },
    },
  },
  plugins: [],
}
