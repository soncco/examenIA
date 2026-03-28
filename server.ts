import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const RESULTS_FILE = path.join(process.cwd(), "results.txt");

  // API routes
  app.post("/api/results", (req, res) => {
    const { name, major, score, date } = req.body;
    const entry = `${date} | Nombre: ${name} | Carrera: ${major} | Nota: ${score}/20\n`;
    
    fs.appendFile(RESULTS_FILE, entry, (err) => {
      if (err) {
        console.error("Error saving result:", err);
        return res.status(500).json({ error: "No se pudo guardar el resultado" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/results", (req, res) => {
    // Simple password check could be here, but we'll handle UI access in frontend
    // For a real app, we'd use a better auth mechanism
    if (!fs.existsSync(RESULTS_FILE)) {
      return res.json({ results: [] });
    }

    fs.readFile(RESULTS_FILE, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading results:", err);
        return res.status(500).json({ error: "No se pudieron leer los resultados" });
      }
      const lines = data.trim().split("\n").filter(line => line.length > 0);
      res.json({ results: lines });
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
