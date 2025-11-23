import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2E7D32',
        secondary: '#FFC107',
        accent: '#1565C0',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #FFD700 0%, #FFC107 100%)',
        'gradient-green': 'linear-gradient(135deg, #2E7D32 0%, #1565C0 100%)',
      },
    },
  },
  plugins: [],
}
export default config
