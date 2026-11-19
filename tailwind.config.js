/** @type {import('tailwindcss').Config} */
// Nexbridge Connect — "Daybreak delta" direction.
// The `brand` scale is coral (sunrise); `navy` is kept as a NAME but remapped
// to a warm plum-ink ramp, so the whole app inherits the direction from tokens.
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // warm plum-ink (was "navy"): headings → deep, 50 → faint wash
        navy: {
          50: "#f6f3f6", 100: "#e9e4ea", 200: "#d6cfd6", 300: "#b6aeb8",
          400: "#8c8290", 500: "#7a6f78", 600: "#675c66", 700: "#4f4654",
          800: "#332b38", 900: "#241f26", 950: "#1a141c",
        },
        // coral sunrise accent (was "brand")
        brand: {
          50: "#fff4ef", 100: "#ffe4d8", 200: "#ffcbb6", 300: "#ffad8c",
          400: "#f87e55", 500: "#ef6a43", 600: "#bb4019", 700: "#9a3415",
          800: "#812d16", 900: "#6c2616", 950: "#42160c",
        },
        surface: { DEFAULT: "#ffffff", muted: "#f7f3ee", sunken: "#efe9e2" },
        dawn: { peach: "#ffe4d0", apricot: "#ffd8c4", blush: "#ffe0e6" },
      },
      fontFamily: {
        sans: ["Hanken Grotesk", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
        display: ["Baloo 2", "Hanken Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Spline Sans Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(58,35,24,.05), 0 1px 3px rgba(58,35,24,.07)",
        pop: "0 14px 40px rgba(58,35,24,.14)",
      },
      borderRadius: { lg: "0.7rem", xl: "1rem", "2xl": "1.25rem" },
    },
  },
  plugins: [],
};
