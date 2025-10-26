import svgLoader from "vite-svg-loader";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["motion-v/nuxt"],
  compatibilityDate: "2025-10-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [svgLoader(), tailwindcss()],
    resolve: {
      alias: {
        "~/utils": resolve(__dirname, "app/utils"),
        "@/utils": resolve(__dirname, "app/utils"),
        "~/assets": resolve(__dirname, "app/assets"),
        "@/assets": resolve(__dirname, "app/assets"),
        "~/types": resolve(__dirname, "app/types"),
        "@/types": resolve(__dirname, "app/types"),
      },
    },
  },
});
