import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

let __filename = "";
let __dirname = "";

try {
  __filename = fileURLToPath(import.meta.url);
  __dirname = path.dirname(__filename);
} catch (e) {
  // Fallback for CommonJS
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Limit request body size to mitigate DoS via large payloads
  app.use(express.json({ limit: "100kb" }));

  // Security Headers Middleware
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
  });

  // AI Chat Proxy Endpoint with Strict Input Validation
  app.post("/api/ai", async (req, res) => {
    const { message, systemInstruction, history } = req.body;

    // 1. Validate prompt message
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "Invalid request: 'message' must be a non-empty string." });
    }

    // Mitigate token exhaustion / DoS by capping payload length
    if (message.length > 4000) {
      return res.status(400).json({ error: "Invalid request: 'message' exceeds maximum length of 4000 characters." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // 2. Validate and sanitize conversation history array
      const sanitizedHistory: Array<{ role: string; parts: Array<{ text: string }> }> = [];
      if (Array.isArray(history)) {
        for (const item of history.slice(-10)) { // Limit history context window to last 10 turns
          if (
            item &&
            typeof item === "object" &&
            (item.role === "user" || item.role === "model") &&
            Array.isArray(item.parts) &&
            item.parts.length > 0 &&
            typeof item.parts[0]?.text === "string"
          ) {
            sanitizedHistory.push({
              role: item.role,
              parts: [{ text: item.parts[0].text.substring(0, 2000) }]
            });
          }
        }
      }

      sanitizedHistory.push({ role: 'user', parts: [{ text: message }] });

      // 3. Safe system instruction fallback
      const safeSystemInstruction = typeof systemInstruction === "string" && systemInstruction.length <= 1000
        ? systemInstruction
        : "You are a helpful AI science assistant.";

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: sanitizedHistory,
        config: {
          systemInstruction: safeSystemInstruction,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("AI Proxy Error:", error?.message || error);
      // Sanitize internal error details before sending response to client
      res.status(500).json({ error: "An error occurred while processing your AI request." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
