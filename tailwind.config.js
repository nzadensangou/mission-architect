/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--c-bg) / <alpha-value>)',
        panel: 'rgb(var(--c-panel) / <alpha-value>)',
        'panel-alt': 'rgb(var(--c-panel-alt) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        primary: 'rgb(var(--c-primary) / <alpha-value>)',
        success: 'rgb(var(--c-success) / <alpha-value>)',
        warning: 'rgb(var(--c-warning) / <alpha-value>)',
        danger: 'rgb(var(--c-danger) / <alpha-value>)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        title: ['2rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        section: ['1.5rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
      },
      boxShadow: {
        panel: '0 24px 60px -32px rgb(0 0 0 / 0.75)',
        glow: '0 0 0 1px rgb(var(--c-primary) / 0.35), 0 0 32px -8px rgb(var(--c-primary) / 0.45)',
      },
      keyframes: {
        pulseAlert: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgb(var(--c-warning) / 0.55)' },
          '50%': { boxShadow: '0 0 0 12px rgb(var(--c-warning) / 0)' },
        },
        drift: {
          '0%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-6px,0)' },
          '100%': { transform: 'translate3d(0,0,0)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(400%)' },
        },
      },
      animation: {
        'pulse-alert': 'pulseAlert 1.8s ease-out infinite',
        drift: 'drift 9s ease-in-out infinite',
        scan: 'scan 6s linear infinite',
      },
    },
  },
  plugins: [],
}
