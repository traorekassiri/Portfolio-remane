import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API to save config
  app.post("/api/config", (req, res) => {
    try {
      const configPath = path.join(__dirname, "public", "config.json");
      fs.writeFileSync(configPath, JSON.stringify(req.body, null, 2));
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving config:", error);
      res.status(500).json({ error: "Failed to save configuration" });
    }
  });

  // API to save markdown files
  app.post("/api/content/:filename", (req, res) => {
    try {
      const { filename } = req.params;
      const { content } = req.body;
      const contentPath = path.join(__dirname, "public", "content", filename);
      fs.writeFileSync(contentPath, content);
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving content:", error);
      res.status(500).json({ error: "Failed to save content" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
