import express from "express";
import type { Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";
import dotenv from "dotenv";
import { customAlphabet } from "nanoid";
import cors from "cors";
import admin from "firebase-admin";
import { z } from "zod";
import fs from "fs";
import JSZip from "jszip";
import { setupMiddleware } from "./server/middleware/security.ts";
import { findRecordByField, getDb } from "./server/services/dbService.ts";

dotenv.config();

// Initialize Firebase Admin (rest of init code)
// ... (omitting for brevity in the edit_file call but will keep same logic)
if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (serviceAccount) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccount)),
      });
    } catch (e) { console.error(e); }
  } else {
    try { admin.initializeApp({ credential: admin.credential.applicationDefault() }); } catch (e) {}
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Setup Production-grade Middleware
setupMiddleware(app);
app.use(cors());

// Validation Schemas
const EmailSchema = z.object({
  email: z.string().email().toLowerCase().trim()
});

const KeyValidationSchema = z.object({
  key: z.string().min(1),
  email: z.string().email().toLowerCase().trim().optional()
});

// JSON Parser
app.use(express.json());

// Optimized Endpoints
app.post("/api/check-subscription", async (req: Request, res: Response) => {
  try {
    const { email } = EmailSchema.parse(req.body);

    // Developer Backdoor
    if (email === "blurraaccesss@gmail.com" || email === "olaoluwaadeyi@gmail.com") {
      return res.json({ valid: true, plan: 'iPro' });
    }

    const record = await findRecordByField("keys", "email", email) as any;
    if (!record) return res.json({ valid: false, message: "No active subscription found" });

    if (record.expires_at && new Date(record.expires_at) < new Date()) {
      return res.json({ valid: false, message: "Subscription expired" });
    }

    res.json({ valid: true, plan: record.plan || 'pro', expires: record.expires_at });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: (err as any).errors });
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/validate-key", async (req: Request, res: Response) => {
  try {
    const { key, email } = KeyValidationSchema.parse(req.body);
    
    // Developer Backdoor
    if (key === "Victor" || key === "DEV-BYPASS") {
      return res.json({ valid: true, plan: 'iPro', features: { maxUsers: 999, whitelabel: true } });
    }

    const record = await findRecordByField("keys", "license_key", key) as any;
    if (!record) return res.json({ valid: false, message: "Key invalid or not found" });

    if (record.expires_at && new Date(record.expires_at) < new Date()) {
      return res.json({ valid: false, message: "Key has expired" });
    }

    res.json({ 
      valid: true, 
      plan: record.plan, 
      expires: record.expires_at,
      features: {
        maxUsers: ['iPro', 'Agency', 'Team'].includes(record.plan) ? 999 : 1,
        whitelabel: ['iPro', 'Agency'].includes(record.plan)
      } 
    });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: (err as any).errors });
    res.status(500).json({ error: "Internal server error" });
  }
});

function addFolderToZip(zipInstance: JSZip, folderPath: string, rootDir: string) {
  const items = fs.readdirSync(folderPath);
  for (const item of items) {
    const fullPath = path.join(folderPath, item);
    const relativePath = path.relative(rootDir, fullPath);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      addFolderToZip(zipInstance, fullPath, rootDir);
    } else {
      const content = fs.readFileSync(fullPath);
      zipInstance.file(relativePath, content);
    }
  }
}

app.get("/extension-beta.zip", async (req: Request, res: Response) => {
  try {
    const prebuiltZip = path.join(process.cwd(), "public", "extension-beta.zip");
    if (fs.existsSync(prebuiltZip)) {
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", "attachment; filename=blurra-privacy-shield-beta.zip");
      return res.sendFile(prebuiltZip);
    }

    const extensionDir = path.join(process.cwd(), "public", "extension");
    if (!fs.existsSync(extensionDir)) {
      return res.status(404).send("Extension files not found.");
    }

    const zip = new JSZip();
    addFolderToZip(zip, extensionDir, extensionDir);

    const content = await zip.generateAsync({ type: "nodebuffer" });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=blurra-privacy-shield-beta.zip");
    res.send(content);
  } catch (err) {
    console.error("Error creating zip:", err);
    res.status(500).send("Error generating extension zip");
  }
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[Global Error] ${req.method} ${req.url}:`, err);
  res.status(500).json({ 
    error: "A system error occurred. Our engineers have been notified.",
    id: Date.now() // For log matching
  });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    // Catch-all for dev routes (vite middleware usually handles this, but being explicit helps)
    app.get('*all', async (req, res, next) => {
      try {
        const url = req.originalUrl;
        if (url.startsWith('/api') || url.includes('.')) {
          return next();
        }
        res.status(200).set({ 'Content-Type': 'text/html' }).send(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Blurra</title>
              <script type="module" src="/src/main.tsx"></script>
            </head>
            <body>
              <div id="root"></div>
            </body>
          </html>
        `);
      } catch (e) {
        next(e);
      }
    });
  } else if (!process.env.VERCEL) {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  }
}

startServer();

export default app;
