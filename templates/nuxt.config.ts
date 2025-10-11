import svgLoader from "vite-svg-loader";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const currentDir = dirname(fileURLToPath(import.meta.url));

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-04-24",
  devtools: { enabled: true },
  css: [join(currentDir, "./assets/css/main.css")],
  vite: {
    plugins: [svgLoader(), tailwindcss()],
  },
});
