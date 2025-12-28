import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",

      // 🚫 DO NOT enable in dev
      devOptions: {
        enabled: false,
      },

      manifest: {
        name: "Pomodoro Focus",
        short_name: "Pomodoro",
        description: "Focus timer with tasks and cloud sync",
        start_url: "/",
        display: "standalone",
        theme_color: "#22c55e",
        background_color: "#0f172a",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
