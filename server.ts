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

  // In-Memory Rate Limiting to prevent API exhaustion / Denial of Wallet
  interface RateLimitRecord {
    count: number;
    resetTime: number;
  }
  const rateLimitMap = new Map<string, RateLimitRecord>();

  // Cleanup stale IP entries periodically every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(ip);
      }
    }
  }, 5 * 60 * 1000).unref();

  const aiRateLimiter = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Extract IP safely from proxy headers or socket
    const forwarded = req.headers['x-forwarded-for'];
    const clientIp = typeof forwarded === 'string'
      ? forwarded.split(',')[0].trim()
      : req.ip || req.socket.remoteAddress || 'unknown-client';

    const windowMs = 60 * 1000; // 1 minute sliding window
    const maxRequests = 30; // Max 30 requests per minute per IP
    const now = Date.now();
    const record = rateLimitMap.get(clientIp);

    if (!record || now > record.resetTime) {
      rateLimitMap.set(clientIp, {
        count: 1,
        resetTime: now + windowMs,
      });
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - 1);
      res.setHeader('X-RateLimit-Reset', Math.ceil((now + windowMs) / 1000));
      return next();
    }

    if (record.count >= maxRequests) {
      const retryAfterSec = Math.max(1, Math.ceil((record.resetTime - now) / 1000));
      res.setHeader('Retry-After', retryAfterSec);
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));
      return res.status(429).json({
        error: "Rate limit exceeded (30 requests/minute). Please wait a moment before sending another AI query.",
        retryAfter: retryAfterSec
      });
    }

    record.count += 1;
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - record.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));
    return next();
  };

  // Apply rate limiter to all /api routes
  app.use("/api", aiRateLimiter);

  // Canonical Site Owner configuration
  const OWNER_EMAIL = (process.env.ADMIN_EMAIL || "wordswithoutwallspublishing@gmail.com").toLowerCase();

  // Dynamic Site Configuration (owner controlled)
  interface SiteConfigState {
    tickerNotice: string;
    broadcastActive: boolean;
    broadcastMessage: string;
    aiChatEnabled: boolean;
    lastUpdated: string;
    updatedBy: string;
  }

  let siteConfig: SiteConfigState = {
    tickerNotice: "⚡ Gemini 1.5 Pro Operational • 🤖 10 Autonomous Agents Online • 🧪 24/7 Zperiod Science Engine Active",
    broadcastActive: false,
    broadcastMessage: "",
    aiChatEnabled: true,
    lastUpdated: new Date().toISOString(),
    updatedBy: "system"
  };

  /**
   * Server-side Owner Authentication & Authorization Middleware
   * Cryptographically validates Firebase ID Token against Google Identity Toolkit
   * and verifies caller matches the canonical site owner email.
   */
  async function authenticateOwner(req: express.Request, res: express.Response, next: express.NextFunction) {
    // 1. Optional Secret Admin Key Header (for automated operations or fallback)
    const adminKey = req.headers["x-admin-key"];
    if (process.env.ADMIN_SECRET_KEY && adminKey && adminKey === process.env.ADMIN_SECRET_KEY) {
      (req as any).ownerEmail = OWNER_EMAIL;
      return next();
    }

    // 2. Extract Bearer token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication required. Only the site owner is authorized to perform this administrative action.",
        code: "UNAUTHORIZED"
      });
    }

    const idToken = authHeader.split(" ")[1];
    if (!idToken) {
      return res.status(401).json({
        error: "Authentication token missing from Authorization header.",
        code: "UNAUTHORIZED"
      });
    }

    try {
      const firebaseApiKey = process.env.FIREBASE_API_KEY || "AIzaSyD8sskOGSqPQCiZHWNSVGT0IW0QHdwI8wk";
      const lookupUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseApiKey}`;

      const lookupResponse = await fetch(lookupUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
      });

      if (!lookupResponse.ok) {
        const errData: any = await lookupResponse.json().catch(() => ({}));
        return res.status(401).json({
          error: "Invalid or expired authentication credentials.",
          code: "INVALID_CREDENTIALS",
          details: errData?.error?.message
        });
      }

      const data: any = await lookupResponse.json();
      const user = data.users?.[0];
      if (!user || !user.email) {
        return res.status(401).json({
          error: "Authenticated user does not have a verified email.",
          code: "NO_EMAIL"
        });
      }

      const callerEmail = user.email.toLowerCase();
      if (callerEmail !== OWNER_EMAIL) {
        return res.status(403).json({
          error: `Access Denied: Account '${callerEmail}' is not authorized. This feature is restricted to the site owner (${OWNER_EMAIL}).`,
          code: "FORBIDDEN"
        });
      }

      (req as any).ownerEmail = callerEmail;
      next();
    } catch (err: any) {
      console.error("Owner Authentication Verification Error:", err?.message || err);
      return res.status(500).json({
        error: "Server authentication error verifying administrator credentials.",
        code: "AUTH_VERIFY_FAILURE"
      });
    }
  }

  // Public Endpoint: Read Current Site Configuration and Broadcast
  app.get("/api/site-config", (req, res) => {
    res.json(siteConfig);
  });

  // Admin-Only Endpoint: Update Site Configuration & Broadcasts
  app.post("/api/admin/site-config", authenticateOwner, (req, res) => {
    const { tickerNotice, broadcastActive, broadcastMessage, aiChatEnabled } = req.body;

    if (typeof tickerNotice === "string") {
      siteConfig.tickerNotice = tickerNotice.trim().substring(0, 300);
    }
    if (typeof broadcastActive === "boolean") {
      siteConfig.broadcastActive = broadcastActive;
    }
    if (typeof broadcastMessage === "string") {
      siteConfig.broadcastMessage = broadcastMessage.trim().substring(0, 500);
    }
    if (typeof aiChatEnabled === "boolean") {
      siteConfig.aiChatEnabled = aiChatEnabled;
    }

    siteConfig.lastUpdated = new Date().toISOString();
    siteConfig.updatedBy = (req as any).ownerEmail || OWNER_EMAIL;

    res.json({
      success: true,
      message: "Site configuration updated successfully.",
      config: siteConfig
    });
  });

  // Admin-Only Endpoint: System Telemetry and Security Health
  app.get("/api/admin/status", authenticateOwner, (req, res) => {
    res.json({
      status: "healthy",
      serverUptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
      ownerEmail: OWNER_EMAIL,
      authenticatedCaller: (req as any).ownerEmail,
      rateLimiter: {
        activeTrackedIps: rateLimitMap.size,
        windowMs: 60000,
        maxPerMinute: 30
      },
      siteConfig,
      systemMemory: process.memoryUsage()
    });
  });

  // Admin-Only Endpoint: Reset In-Memory Rate Limit Tracking Table
  app.post("/api/admin/reset-rate-limits", authenticateOwner, (req, res) => {
    const previousCount = rateLimitMap.size;
    rateLimitMap.clear();
    res.json({
      success: true,
      message: `Cleared ${previousCount} rate limit tracker entries.`
    });
  });

  // AI Chat Proxy Endpoint with Strict Input Validation
  app.post("/api/ai", async (req, res) => {
    if (!siteConfig.aiChatEnabled) {
      return res.status(503).json({
        error: "AI Chat is temporarily disabled by the site administrator."
      });
    }

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

  // Dedicated STEM News Generator Endpoint (Restricted to Authorized Site Owner)
  app.post("/api/news/generate", authenticateOwner, async (req, res) => {
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

  // ==========================================
  // In-Person Services Booking & Email Dispatch
  // ==========================================
  interface ServiceBooking {
    bookingId: string;
    service: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    location: string;
    preferredDate: string;
    groupSize: string;
    notes: string;
    status: string;
    createdAt: string;
    emailDispatched: boolean;
    dispatchMethod?: string;
  }

  const recentBookings: ServiceBooking[] = [];

  app.post("/api/bookings", async (req, res) => {
    const { name, email, phone, service, location, preferredDate, groupSize, notes } = req.body;

    if (!name || !email || !service) {
      return res.status(400).json({ error: "Name, email, and service are required to book." });
    }

    // Basic email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    const bookingId = `DA-BK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const createdAt = new Date().toISOString();

    let emailDispatched = false;
    let dispatchMethod = "none";
    let dispatchError = "";

    const confirmationSubject = `[Booking Confirmed #${bookingId}] ${service} - Development Archive`;
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; background-color: #0b0f17; color: #ffffff; padding: 24px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1f293d;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #00ff88; margin: 0; font-size: 24px; letter-spacing: 1px;">DEVELOPMENT ARCHIVE</h1>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">In-Person Professional Training & Scientific Advisory</p>
        </div>
        
        <div style="background-color: #131a29; border-radius: 8px; padding: 20px; border-left: 4px solid #00ff88; margin-bottom: 20px;">
          <h2 style="margin-top: 0; font-size: 18px; color: #ffffff;">Booking Confirmation Receipt</h2>
          <p style="margin: 4px 0; color: #94a3b8;">Reference Code: <strong style="color: #00ff88;">#${bookingId}</strong></p>
          <p style="margin: 4px 0; color: #94a3b8;">Status: <span style="color: #38bdf8; font-weight: bold;">Confirmed & Registered</span></p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; color: #e2e8f0; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; width: 35%;">Requested Service:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #ffffff;">${service}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Target Date / Time:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #00ff88;">${preferredDate || 'Flexible / To Be Arranged'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Verified Location:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #ffffff;">${location || 'Development Archive Studio'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Client Name:</td>
            <td style="padding: 8px 0; color: #ffffff;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Contact Email:</td>
            <td style="padding: 8px 0; color: #ffffff;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Contact Phone:</td>
            <td style="padding: 8px 0; color: #ffffff;">${phone || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Group Size:</td>
            <td style="padding: 8px 0; color: #ffffff;">${groupSize || '1-5 participants'}</td>
          </tr>
          ${notes ? `<tr><td style="padding: 8px 0; color: #94a3b8;">Notes:</td><td style="padding: 8px 0; color: #cbd5e1;">${notes}</td></tr>` : ''}
        </table>

        <div style="background-color: #0d131f; border-radius: 8px; padding: 16px; font-size: 12px; color: #94a3b8; margin-bottom: 20px;">
          <p style="margin: 0 0 8px 0;"><strong style="color: #ffffff;">What happens next?</strong></p>
          <p style="margin: 0 0 4px 0;">1. Your session lead is reviewing your target date and curriculum focus.</p>
          <p style="margin: 0 0 4px 0;">2. You will receive direct calendar invites and syllabus notes prior to the session.</p>
          <p style="margin: 0;">3. Need to reschedule or ask questions? Reply directly to this email or contact <a href="mailto:${OWNER_EMAIL}" style="color: #00ff88;">${OWNER_EMAIL}</a>.</p>
        </div>

        <div style="text-align: center; border-top: 1px solid #1f293d; padding-top: 16px; font-size: 11px; color: #64748b;">
          Development Archive • developmentarchive.net • Dedicated Science & STEM Pedagogical Platform
        </div>
      </div>
    `;

    // 1. Try Resend if configured
    if (process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM || "Development Archive <onboarding@resend.dev>",
            to: [email, OWNER_EMAIL],
            subject: confirmationSubject,
            html: confirmationHtml
          })
        });
        if (resendRes.ok) {
          emailDispatched = true;
          dispatchMethod = "resend";
        } else {
          const resendErr = await resendRes.text();
          console.warn("Resend email dispatch warning:", resendErr);
          dispatchError = resendErr;
        }
      } catch (err: any) {
        console.warn("Resend email exception:", err?.message || err);
        dispatchError = err?.message || "Resend failed";
      }
    }

    // 2. Try Nodemailer / SMTP if not yet dispatched
    if (!emailDispatched && (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD)) {
      try {
        const nodemailer = await import("nodemailer");
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: parseInt(process.env.SMTP_PORT || "465"),
          secure: (process.env.SMTP_PORT || "465") === "465",
          auth: {
            user: process.env.SMTP_USER || process.env.GMAIL_USER || OWNER_EMAIL,
            pass: process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD
          }
        });

        await transporter.sendMail({
          from: `"Development Archive Bookings" <${process.env.SMTP_USER || OWNER_EMAIL}>`,
          to: email,
          cc: OWNER_EMAIL,
          replyTo: OWNER_EMAIL,
          subject: confirmationSubject,
          html: confirmationHtml
        });

        emailDispatched = true;
        dispatchMethod = "smtp";
      } catch (smtpErr: any) {
        console.warn("SMTP email dispatch warning:", smtpErr?.message || smtpErr);
        dispatchError = smtpErr?.message || "SMTP failed";
      }
    }

    const newBooking: ServiceBooking = {
      bookingId,
      service,
      clientName: name,
      clientEmail: email,
      clientPhone: phone || "",
      location: location || "In-Person Studio",
      preferredDate: preferredDate || "Flexible",
      groupSize: groupSize || "1-5 participants",
      notes: notes || "",
      status: "confirmed",
      createdAt,
      emailDispatched,
      dispatchMethod
    };

    // Store in memory ring buffer
    recentBookings.unshift(newBooking);
    if (recentBookings.length > 100) {
      recentBookings.pop();
    }

    res.json({
      success: true,
      bookingId,
      emailDispatched,
      dispatchMethod,
      dispatchError: dispatchError || undefined,
      message: emailDispatched
        ? `Booking confirmed! Confirmation email dispatched to ${email}.`
        : `Booking recorded under reference #${bookingId}.`,
      booking: newBooking
    });
  });

  // Admin endpoint: List recent service bookings
  app.get("/api/admin/bookings", authenticateOwner, (req, res) => {
    res.json({
      total: recentBookings.length,
      bookings: recentBookings
    });
  });

  // Contact form submission & email notification endpoint
  app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }

    const contactId = `DA-MSG-${Date.now().toString(36).toUpperCase()}`;
    const subject = `[Inquiry #${contactId}] Development Archive Message from ${name}`;
    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #0b0f17; color: #ffffff; padding: 24px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1f293d;">
        <h2 style="color: #00ff88; margin-top: 0;">New Message from Development Archive Contact Form</h2>
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        <p><strong>Reference ID:</strong> #${contactId}</p>
        <div style="background-color: #131a29; border-radius: 8px; padding: 16px; margin: 16px 0; border-left: 3px solid #00ff88; color: #e2e8f0; white-space: pre-wrap;">
          ${message}
        </div>
        <p style="font-size: 12px; color: #94a3b8;">Sent via Development Archive (developmentarchive.net)</p>
      </div>
    `;

    let emailDispatched = false;

    if (process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM || "Development Archive <onboarding@resend.dev>",
            to: [OWNER_EMAIL],
            reply_to: email,
            subject,
            html
          })
        });
        if (resendRes.ok) emailDispatched = true;
      } catch (err) {
        console.warn("Resend contact dispatch warning:", err);
      }
    }

    if (!emailDispatched && (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD)) {
      try {
        const nodemailer = await import("nodemailer");
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: parseInt(process.env.SMTP_PORT || "465"),
          secure: (process.env.SMTP_PORT || "465") === "465",
          auth: {
            user: process.env.SMTP_USER || process.env.GMAIL_USER || OWNER_EMAIL,
            pass: process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD
          }
        });

        await transporter.sendMail({
          from: `"Development Archive Contact" <${process.env.SMTP_USER || OWNER_EMAIL}>`,
          to: OWNER_EMAIL,
          replyTo: email,
          subject,
          html
        });
        emailDispatched = true;
      } catch (err) {
        console.warn("SMTP contact dispatch warning:", err);
      }
    }

    res.json({
      success: true,
      contactId,
      emailDispatched,
      message: "Message received successfully."
    });
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
