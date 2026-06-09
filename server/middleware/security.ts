import rateLimit from "express-rate-limit";
import helmet from "helmet";
import compression from "compression";
import type { Express } from "express";

export const setupMiddleware = (app: Express) => {
  // Security headers
  app.use(helmet({
    contentSecurityPolicy: false, // Vite needs this disabled for dev
  }));

  // Gzip compression for faster transfers
  app.use(compression());

  // Rate limiting to prevent abuse
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." }
  });

  // Apply rate limiter to API routes
  app.use("/api", apiLimiter);
};
