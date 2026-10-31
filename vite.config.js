import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base relativa: funciona em qualquer subcaminho (GitHub Pages, por exemplo)
export default defineConfig({ base: "./", plugins: [react()], server: { port: 5175 }, test: { environment: "node" } });
