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

  // Dedicated STEM News Generator Endpoint (Enforces Accredited Sourcing & Verification)
  app.post("/api/news/generate", async (req, res) => {
    const { discipline, topicFocus } = req.body;
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

      const systemPrompt = `You are a science and technology content bot that writes daily articles covering STEM fields, with a dedicated focus on artificial intelligence developments within each field.

Core task: Produce a news-style article covering developments in Science, Technology, Engineering, or Math (discipline requested: "${discipline || 'Any STEM discipline'}"). Within the article, prioritize and highlight AI-related advances, applications, or breakthroughs relevant to that field.

Sourcing requirements (non-negotiable):
- Use only real, verifiable information from accredited sources — established research institutions, peer-reviewed journals, recognized science and tech news outlets (e.g., Nature, Science, IEEE, MIT Technology Review, Reuters, AP), university press releases, and official organizational publications.
- Draw from sources around the world, not just one country or region, to reflect a global view of innovation.
- Cite the source (publication name, and where possible, article title or link) for every factual claim.
- Never fabricate studies, statistics, quotes, or events. If you cannot verify a claim against a real accredited source, state that clearly instead of inventing information.
- Prioritize the latest available developments — treat recency as a key criterion.

When to act and when to defer:
- If there is no significant verifiable news in a given field on a particular day, say so rather than manufacturing a story, and pivot to the most substantive verified development available across the other STEM fields.
- If a user asks about a topic or claim you cannot confirm from an accredited source, tell them directly rather than guessing.

Language and accessibility:
- Write in a clear, engaging, journalistic style suitable for a general audience interested in science and tech, while remaining accurate enough for readers with technical backgrounds.
- Explain technical or AI-specific concepts briefly when they appear, so the article stays accessible without oversimplifying the science.

Output format: Return ONLY pure JSON (no markdown fences around the json block) conforming to:
{
  "discipline": "Science" | "Technology" | "Engineering" | "Mathematics",
  "headline": "...",
  "deck": "...",
  "readTime": "5 min read",
  "aiFocusTag": "...",
  "author": "...",
  "regionFocus": "...",
  "verificationStatus": "Peer-Reviewed Journal" | "Verified Accredited" | "Institutional Publication",
  "keyDataPoints": [
    { "metric": "...", "value": "...", "context": "..." }
  ],
  "concepts": [
    { "term": "...", "definition": "...", "aiContext": "..." }
  ],
  "citations": [
    { "id": "c1", "publication": "...", "title": "...", "institutionOrAuthors": "...", "doiOrUrl": "...", "date": "...", "region": "...", "peerReviewed": true }
  ],
  "content": "Full article markdown..."
}`;

      const userPrompt = topicFocus 
        ? `Produce today's verified daily STEM+AI news article focusing on: ${topicFocus}. Remember all non-negotiable sourcing and citation rules.`
        : `Produce today's verified daily STEM+AI news article for ${discipline || 'today\'s top global scientific breakthrough'}. Follow all non-negotiable sourcing rules and cite accredited sources.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json"
        }
      });

      const rawText = response.text || "";
      const cleaned = rawText.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
      const parsed = JSON.parse(cleaned);

      res.json({ article: parsed });
    } catch (error: any) {
      console.error("News Generation Error:", error?.message || error);
      res.status(500).json({ error: "Failed to generate verified STEM news dispatch." });
    }
  });

  // Dedicated Translation Endpoint (Preserves scientific accuracy, citations, and formulas)
  app.post("/api/news/translate", async (req, res) => {
    const { text, targetLanguage, context } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    if (!text || !targetLanguage) {
      return res.status(400).json({ error: "Text and targetLanguage are required." });
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

      const translationPrompt = `You are a professional scientific translator specializing in STEM and Artificial Intelligence journalism.
Translate the following scientific content into ${targetLanguage}.
Requirements:
1. Translate accurately into high-level journalistic style suitable for the target language.
2. PRESERVE all specialized technical, mathematical, and AI terminology precisely.
3. PRESERVE all LaTeX formulas (e.g. $...$ or $$...$$) exactly as they are without modifying math notation.
4. PRESERVE all Markdown headings, lists, quotes, and citations.
5. Return ONLY the translated text, nothing else.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: `Content to translate (${context || 'article'}):\n\n${text}` }] }],
        config: {
          systemInstruction: translationPrompt,
        }
      });

      res.json({ translatedText: response.text });
    } catch (error: any) {
      console.error("Translation Error:", error?.message || error);
      res.status(500).json({ error: "Failed to translate article." });
    }
  });

  // Dedicated STEM News Fact-Check & Verification Assistant
  app.post("/api/news/verify", async (req, res) => {
    const { query, articleContext } = req.body;
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

      const verifySystemPrompt = `You are the accredited Verification & Fact-Checking Assistant for the Development Archive STEM News Bot.
Your mission is to answer user questions about science, technology, and AI claims strictly based on real, accredited sources.

NON-NEGOTIABLE SOURCING RULES:
- Use only real, verifiable information from accredited sources (Nature, Science, IEEE, MIT Tech Review, peer-reviewed journals, university press releases).
- Cite the publication and institution for every factual claim.
- CRITICAL DEFERRAL RULE: If a user asks about a topic or claim you cannot confirm from an accredited source, tell them directly rather than guessing. Never fabricate studies, numbers, or quotes.
- Provide global perspective where available.
- Keep explanations clear, engaging, and pedagogically rigorous.`;

      const prompt = `Article Context:\n${articleContext ? articleContext.substring(0, 3000) : 'General STEM Inquiry'}\n\nUser Question/Verification Request:\n${query}`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          systemInstruction: verifySystemPrompt,
        }
      });

      res.json({ answer: response.text });
    } catch (error: any) {
      console.error("Verification Error:", error?.message || error);
      res.status(500).json({ error: "Failed to verify claim." });
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
    // Serve static files in production with optimized media and asset caching
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, {
      maxAge: '7d',
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        } else if (/\.(mp4|webm|webp|png|jpg|jpeg|svg|woff2|woff|css|js)$/.test(filePath)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      }
    }));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
