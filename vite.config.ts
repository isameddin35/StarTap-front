// import path from "path"
// import react from "@vitejs/plugin-react"
// import { defineConfig } from "vite"

// // https://vite.dev/config/
// export default defineConfig({
//   base: './',
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// });


// import path from "path"
// import react from "@vitejs/plugin-react"
// import { defineConfig } from "vite"

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   server: {
//     allowedHosts: 'all',
//     host: true,          // IMPORTANT: expose to network
//     port: 5173,
//     strictPort: true,
//     hmr: {
//       clientPort: 443,   // IMPORTANT for tunnels (Cloudflare/ngrok)
//     },
//   },
// })


import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },


  server: {
    host: true,
    port: 5173,
    strictPort: true,

    allowedHosts: true,

    proxy: {
      "/api": {
        target: "http://backend:8080",
        changeOrigin: true,
        secure: false,
      },
    },

    hmr: {
      protocol: "wss",
      clientPort: 443,
    },
  }
})
