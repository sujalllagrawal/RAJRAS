/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FBF5EA", // Warm off-white main canvas
          soft: "#F3E9D7",    // Warm Ivory container background
          line: "#E7DABE",    // Subtle border color
        },
        rajras: {
          red: "#8C2B1E",       // Deep Rajput Red primary brand color
          "red-dark": "#6C2016",
          "red-deep": "#3A120D",
        },
        saffron: {
          DEFAULT: "#C98A2C",  // Muted saffron accent
          soft: "#E3B364",
        },
        ink: {
          DEFAULT: "#231A15",  // Deep Charcoal text
          soft: "#4A3E36",
          faint: "#7A6B5F",
        },
      },
      fontFamily: {
        display: ["'DM Serif Display'", "Georgia", "serif"],
        body: ["'Inter'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.24em",
      },
      boxShadow: {
        card: "0 12px 32px -16px rgba(35, 26, 21, 0.12)",
        lift: "0 20px 40px -18px rgba(140, 43, 30, 0.35)",
      },
      borderRadius: {
        tiffin: "12px",
      },
      maxWidth: {
        content: "1240px",
      },
      keyframes: {
        riseIn: {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        riseIn: "riseIn 0.6s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};
