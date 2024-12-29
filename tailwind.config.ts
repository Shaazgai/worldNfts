/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "7rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontSize: {
      xs: ["10px", "12px"],
      sm: ["12px", "16px"],
      md: ["14px", "18px"],
      md2: ["15px", "24px"],
      lg: ["16px", "20px"],
      lg2: ["17px", "24px"],
      xl: ["20px", "24px"],
      "2xl": ["24px", "36px"],
      "3xl": ["32px", "40px"],
      "4xl": ["40px", "54px"],
      "5xl": ["40px", "48px"],
      "6xl": ["64px", "64px"],
      btnSmall: ["13px", "16px"],
      btnMedium: ["15px", "24px"],
      logoSize: ["40px", "44px"],
      logoMobile: ["20px", "28px"],
      cartDesktop: ["28px", "40px"],
      faq: ["24px", "36px"],
      aboutUs: ["24px", "32px"],
      faqExtended: ["20px", "28px"],
      featured: ["32px", "44px"],
      blueTitle: ["56px", "68px"],
      smallTitles: ["16px", "22px"],
      profileTitle: ["28px", "36px"],
      headText: ["88px", "88px"],
    },
    extend: {
      backdropBlur: {
        sm: "4px",
        "2xl": "32px",
        "3xl": "60px",
      },
      backgroundImage: {
        backgroundImg: "url('/background.png')",
        slideImg: "url('/slide.png')",
        serviceBg1: "url('/homePage/serviceBg1.png.png')",
        serviceBG2: "url('/homePage/serviceBG2.png')",
        serviceBG3: "url('/homePage/serviceBG3.png')",
        contactBg: "url('/homePage/contactBg.png')",

        "secondary-less": "var(--Black-less-opacity, rgba(33, 37, 41, 0.70))",
      },
      fontFamily: {
        chakra: ["Chakra Petch", "sans-serif"],
      },
      colors: {
        // brand: "#D3F85A",
        brand: "#FFEE32",
        brand50: "#FFFCD6",
        brand100: "#FFF9BB",
        brand200: "#FFF698",
        brand300: "#FFF476",
        brand400: "#FFF154",
        brand500: "#FFEE32",
        brand600: "#D4C62A",
        brand700: "#AA9F21",
        brand800: "#807719",
        brand900: "#554F11",
        background: "#111315",
        white4: " rgba(255, 255, 255, 0.04)",
        white8: "rgba(255, 255, 255, 0.08)",
        white16: "rgba(255, 255, 255, 0.16)",
        gray30: "rgba(255, 255, 255, 0.3)",
        gray50: "rgba(32, 34, 36, 0.5)",
        gray70: "rgba(255, 255, 255, 0.7)",
        brandBlack: "var(--Black-less-opacity, rgba(52, 61, 64, 0.50))",
        bannerBlack: "var(--Black-less-opacity, rgba(33, 37, 41, 0.70))",
        neutral00: "#ffffff",
        neutral50: "#D7D8D8",
        neutral100: "#B0B0B1",
        neutral200: "#88898A",
        neutral300: "#3E4042",
        neutral400: "#2F3133",
        neutral500: "#202224",
        neutral600: "#111315",
        neutral700: "#2CB59E",
        gradientStart: "#202224",
        gradientEnd: "#343A40",
        neutral500Rgb: "rgba(52, 58, 64, 0.7)",
        success: "#2CB59E",
        success20: "rgba(44, 181, 158, 0.2)",
        errorMsg: "#ff5c69",
        infoMsg: "#6db5e5",
      },
      border: {
        border1: "border-width: 1px",
      },
      backgrounds: {
        primaryBrandGrad: "",
        neutral500: "#2B2B2B",
      },
      boxShadow: {
        shadowBrand: "0 0 240px 0 #FD7C5B",
        shadowFeatured: "0 0 240px 0 #464DFF",
        shadowHover: "0 60px 203px 1px rgba(211, 248, 90, 0.5)",
        shadowBrands: "0 4px 24px 1px rgba(211, 248, 90, 0.5)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-up": "slide-up 0.3s ease-in-out",
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      md2: "856px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
      "3xl": "1920px",
      "4xl": "2048px",
    },
  },
  variants: {
    extend: {
      backdropBlur: ["responsive"],
      "4xl": "120px",
    },
  },
  plugins: [require("tailwindcss-animate")],
};
