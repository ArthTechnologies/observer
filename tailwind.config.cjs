/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],

  daisyui: {
    themes: [
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          "color-scheme": "dark",
          primary: "#ff4c29",
          "primary-content": "#ffffff",
          secondary: "#fb923c",
          "secondary-content": "#ffffff",
          accent: "#1FB2A5",
          "accent-content": "#ffffff",
          neutral: "#13171e",
          "neutral-content": "#A6ADBB",
 "base-100": "#181f2a",
          "base-200": "#1d2532",
          "base-300": "#232b39",
          "base-content": "#A6ADBB",
        },
        light: {
          ...require("daisyui/src/theming/themes")["light"],

          primary: "#0aa6a8",
          secondary: "#cc4304",
          accent: "#88C0D0",

          "base-100": "#ECEFF4",
          "base-200": "#D6DCE8",
          "base-300": "#CED3E4",
          "base-content": "#2E3440",

          "--rounded-box": "0.55rem",
          "--rounded-btn": "0.35rem",
          "--rounded-badge": "0.55rem",
          "--tab-radius": "0.35rem",
        },
      },
    ],
  },
};
