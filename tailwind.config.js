/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'md': '768px',   // Tablet
        'lg': '1280px',  // Desktop
        'xl': '1920px',  // Wide / 4K
      },
      colors: {
        // Cores serão mapeadas das CSS variables
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        border: 'var(--color-border)',
        error: 'var(--color-error)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
      },
    },
  },
  plugins: [],
}
