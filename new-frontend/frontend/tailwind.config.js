import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#f472b6',   // Tailwind pink-400
          DEFAULT: '#ec4899', // Tailwind pink-500
          dark: '#be185d',    // Tailwind pink-700
        },
        primary: {
          DEFAULT: '#ec4899',
          light: '#f472b6',
          dark: '#be185d',
        },
        accent: {
          light: 'var(--color-accent-light)',
          DEFAULT: 'var(--color-accent)',
          dark: 'var(--color-accent-dark)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          muted: 'var(--color-surface-muted)',
          alt: 'var(--color-surface-alt)',
        },
        content: {
          DEFAULT: 'var(--color-content)',
          secondary: 'var(--color-content-secondary)',
          inverted: 'var(--color-content-inverted)',
        },
        border: 'var(--color-border)',
        overlay: 'var(--color-overlay)',
        muted: 'var(--color-muted)',
        gradient: {
          from: 'var(--color-gradient-from)',
          to: 'var(--color-gradient-to)',
        },
        admin: {
          light: 'var(--color-admin-light)',
          DEFAULT: 'var(--color-admin)',
          dark: 'var(--color-admin-dark)',
          hover: 'var(--color-admin-hover)',
          active: 'var(--color-admin-active)',
          border: 'var(--color-admin-border)',
        },
        doctor: {
          light: 'var(--color-doctor-light)',
          DEFAULT: 'var(--color-doctor)',
          dark: 'var(--color-doctor-dark)',
          hover: 'var(--color-doctor-hover)',
          active: 'var(--color-doctor-active)',
          border: 'var(--color-doctor-border)',
        },
        staff: {
          light: 'var(--color-staff-light)',
          DEFAULT: 'var(--color-staff)',
          dark: 'var(--color-staff-dark)',
          hover: 'var(--color-staff-hover)',
          active: 'var(--color-staff-active)',
          border: 'var(--color-staff-border)',
        },
        customer: {
          light: 'var(--color-customer-light)',
          DEFAULT: 'var(--color-customer)',
          dark: 'var(--color-customer-dark)',
          hover: 'var(--color-customer-hover)',
          active: 'var(--color-customer-active)',
          border: 'var(--color-customer-border)',
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [
    plugin(function({ addBase }) {
      addBase({
        ':root': {
          '--color-brand-light': '#f472b6',
          '--color-brand': '#ec4899',
          '--color-brand-dark': '#be185d',
          '--color-accent-light': '#f472b6',
          '--color-accent': '#ec4899',
          '--color-accent-dark': '#be185d',
          '--color-surface': '#ffffff',
          '--color-surface-muted': '#f3f4f6',
          '--color-surface-alt': '#f0f4ff',
          '--color-content': '#111827',
          '--color-content-secondary': '#6b7280',
          '--color-content-inverted': '#f9fafb',
          '--color-border': '#e5e7eb',
          '--color-overlay': 'rgba(0, 0, 0, 0.4)',
          '--color-muted': '#f3f4f6',
          '--color-gradient-from': '#ec4899',
          '--color-gradient-to': '#8b5cf6',
          '--color-admin-light': '#ede9fe',
          '--color-admin': '#a78bfa',
          '--color-admin-dark': '#6d28d9',
          '--color-admin-hover': '#c4b5fd',
          '--color-admin-active': '#7c3aed',
          '--color-admin-border': '#ddd6fe',
          '--color-doctor-light': '#dbeafe',
          '--color-doctor': '#2563eb',
          '--color-doctor-dark': '#1e40af',
          '--color-doctor-hover': '#60a5fa',
          '--color-doctor-active': '#1d4ed8',
          '--color-doctor-border': '#bfdbfe',
          '--color-staff-light': '#d1fae5',
          '--color-staff': '#16a34a',
          '--color-staff-dark': '#166534',
          '--color-staff-hover': '#6ee7b7',
          '--color-staff-active': '#15803d',
          '--color-staff-border': '#bbf7d0',
          '--color-customer-light': '#fce7f3',
          '--color-customer': '#ec4899',
          '--color-customer-dark': '#be185d',
          '--color-customer-hover': '#f9a8d4',
          '--color-customer-active': '#db2777',
          '--color-customer-border': '#fbcfe8',
        },
      });
    })
  ],
}

