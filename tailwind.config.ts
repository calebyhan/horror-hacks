import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#0a0a0f',
          secondary: '#121218',
          danger: '#1a0a0a',
        },
        entity: {
          shadow: '#1a1a2e',
          frozen: '#2a2a3e',
          highlight: '#3a3a5e',
        },
        ui: {
          primary: '#ffffff',
          secondary: '#8e8e93',
          accent: '#ff3b30',
          success: '#34c759',
        },
      },
      fontFamily: {
        mono: ['Courier New', 'Monaco', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;