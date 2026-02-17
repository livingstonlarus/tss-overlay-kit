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
            letterSpacing: {
                'technical': '0.3em', // For Tagline
                'block': '-0.025em',  // For Logotype
            },
            colors: {
                // Semantic Colors mapped to CSS Vars
                dashboard: {
                    base: 'rgb(var(--bg-dashboard) / <alpha-value>)',
                    slot: 'rgb(var(--bg-slot) / <alpha-value>)',
                },
                din: {
                    border: 'rgb(var(--border-din) / <alpha-value>)',
                },
                content: {
                    main: 'rgb(var(--text-main) / <alpha-value>)',
                    dim: 'rgb(var(--text-dim) / <alpha-value>)',
                },
                // Safety Signals (Constant)
                signal: {
                    orange: '#FF5F00',
                    green: '#00D445',
                    blue: '#0057FF',
                    crimson: '#DC2626',
                }
            },
            fontFamily: {
                headline: ['Barlow Condensed', 'sans-serif'],
                label: ['Manrope', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
                sans: ['Inter', 'sans-serif'],
            },
            backgroundImage: {
                'void-texture': 'repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(125,125,125,0.05) 19px, rgba(125,125,125,0.05) 20px)',
            }
        }
    },
    plugins: [],
}
