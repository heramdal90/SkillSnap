import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

// API runs on PORT 8080 (artifacts/api-server). This dev server must use a different port.
// Set VITE_API_BASE_URL in .env (e.g. https://skillsnap-ushm.onrender.com/api or http://localhost:8080/api).
// Deployed UI: https://skillsnap-admin-one.vercel.app
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const adminPort = Number(
    env.ADMIN_DEV_PORT || env.VITE_ADMIN_PORT || process.env.ADMIN_DEV_PORT || 5173,
  );

  return {
    server: {
      // `true` = all interfaces; `::` can break HMR WebSocket on some Windows setups after refresh.
      host: true,
      port: adminPort,
      // If 5173 is taken (stale dev server), use the next free port instead of failing.
      strictPort: false,
      hmr: {
        overlay: false,
      },
    },
    clearScreen: false,
    plugins: [
      react(),
      mode === "development" && {
        name: "skillsnap-admin-request-log",
        configureServer(server) {
          server.middlewares.use((req, _res, next) => {
            const u = req.url ?? "";
            if (!u.includes("@vite") && !u.includes("@react-refresh")) {
              console.log(`[admin] ${req.method} ${u}`);
            }
            next();
          });
        },
      },
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
    },
  };
});
