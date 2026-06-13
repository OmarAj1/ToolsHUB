/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',   // blue-500
        secondary: '#8B5CF6', // purple-500
        background: '#0F172A', // slate-900
        surface: '#1E293B',   // slate-800
        textMain: '#F8FAFC',  // slate-50
        borderMain: '#334155', // slate-700
        success: '#10B981',   // emerald-500
        warning: '#F59E0B',   // amber-500
        error: '#EF4444',     // red-500
      }
    },
  },
  plugins: [],
}
