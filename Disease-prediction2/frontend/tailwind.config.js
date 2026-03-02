/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#6366f1",
                secondary: "#a855f7",
                accent: "#f43f5e",
                dark: "#0f172a",
                darker: "#020617",
            },
            fontFamily: {
                outfit: ["Outfit", "sans-serif"],
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}
