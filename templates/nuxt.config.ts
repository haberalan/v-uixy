import svgLoader from "vite-svg-loader";
import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-04-24",
  css: ["./assets/css/main.css"],
  modules: ["motion-v/nuxt"],
  devtools: { enabled: true },
  vite: {
    plugins: [svgLoader(), tailwindcss()],
  },
});
