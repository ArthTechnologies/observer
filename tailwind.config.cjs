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
                    ...require("daisyui/src/colors/themes")[
                        "[data-theme=dark]"
                    ],
                    primary: "#088385",
                    secondary: "#cc4304",

                },
                light: {
                    ...require("daisyui/src/colors/themes")[
                        "[data-theme=light]"
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
