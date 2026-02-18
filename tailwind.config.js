/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,html}",
    ],
    theme: {
        extend: {
            borderRadius: {
                DEFAULT: '0px',
            },
            colors: {
                // Structural (Adaptive) — DE-002 §13.2
                dashboard: {
                    matte: 'rgb(var(--bg-dashboard) / <alpha-value>)',
                    dim: 'rgb(var(--bg-dim) / <alpha-value>)',
                },
                din: {
                    border: 'rgb(var(--border-din) / <alpha-value>)',
                },
                content: {
                    main: 'rgb(var(--text-main) / <alpha-value>)',
                    dim: 'rgb(var(--text-dim) / <alpha-value>)',
                },
                // Backlights (Constant — High Saturation) — DE-002 §13.2
                backlight: {
                    orange: '#FF5F00',
                    green: '#00D445',
                    blue: '#0057FF',
                }
            },
            fontFamily: {
                // DE-004 §2 Typography
                headline: ['Barlow Condensed', 'sans-serif'],
                label: ['Manrope', 'sans-serif'],
                readout: ['JetBrains Mono', 'monospace'],
                sans: ['Inter', 'sans-serif'],
            },
            backgroundImage: {
                'void-texture': 'repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(125,125,125,0.05) 19px, rgba(125,125,125,0.05) 20px)',
            }
        }
    },
    plugins: [],
}
