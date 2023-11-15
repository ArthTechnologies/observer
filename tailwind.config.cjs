/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,svelte,ts}"],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui"),
require('@tailwindcss/typography')],

    daisyui: {
        themes: [
            {
                dark: {
                    ...require("daisyui/src/theming/themes")[
                        "dark"
                    ],
                    "color-scheme": "dark",
                    primary: "#088385",
                    secondary: "#cc4304",
                    accent: "#1FB2A5",
                    neutral: "#191D24",
                    "base-100": "#2A303C",
                    "base-200": "#242933",
                    "base-300": "#20252E",
                    "base-content": "#A6ADBB",

                },
                light: {
                    ...require("daisyui/src/theming/themes")[
                        "light"
                    ],
                    primary: "#cc4304",
                    secondary: "#088385",
                    "base-100": "#e5dfd7",
                    "base-200": "#888888",
                    "base-300": "#aaaaaa",
                    

                },
            },
        ],
    },
}
