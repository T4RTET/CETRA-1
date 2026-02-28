import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { signupSchema, loginSchema } from "@shared/schema";
import { z } from "zod";
import { readFileSync } from "fs";
import { join } from "path";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  date: string;
  content: string;
}

function loadBlogArticles(): BlogArticle[] {
  const data = readFileSync(join(process.cwd(), "data", "blog.json"), "utf-8");
  return JSON.parse(data);
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
}

function sanitize(str: string): string {
  return str.trim().toLowerCase();
}

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const PgStore = connectPgSimple(session);
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    app.set("trust proxy", 1);
  }

  app.use(
    session({
      store: new PgStore({
        pool,
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || "cetra-dev-secret-change-me",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
      },
    })
  );

  app.post("/api/signup", authLimiter, async (req, res) => {
    try {
      const { email, password } = signupSchema.parse(req.body);
      const cleanEmail = sanitize(email);

      const existing = await storage.getUserByEmail(cleanEmail);
      if (existing) {
        return res.status(409).json({ message: "An account with this email already exists" });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await storage.createUser(cleanEmail, passwordHash);

      req.session.userId = user.id;
      req.session.save(() => {
        const { passwordHash: _, ...safe } = user;
        res.status(201).json(safe);
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Signup error:", err);
      res.status(500).json({ message: "Server error. Please try again." });
    }
  });

  app.post("/api/login", authLimiter, async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const cleanEmail = sanitize(email);

      const user = await storage.getUserByEmail(cleanEmail);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      req.session.userId = user.id;
      req.session.save(() => {
        const { passwordHash: _, ...safe } = user;
        res.json(safe);
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Login error:", err);
      res.status(500).json({ message: "Server error. Please try again." });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out" });
    });
  });

  app.get("/api/me", requireAuth, async (req, res) => {
    const user = await storage.getUserById(req.session.userId!);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const { passwordHash: _, ...safe } = user;
    res.json(safe);
  });

  app.get("/api/blog", (_req, res) => {
    const articles = loadBlogArticles();
    const list = articles.map(({ content, ...rest }) => rest);
    res.json(list);
  });

  app.get("/api/blog/:slug", (req, res) => {
    const articles = loadBlogArticles();
    const article = articles.find((a) => a.slug === req.params.slug);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  });

  app.post("/api/use-trial-run", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUserById(req.session.userId!);
      if (!user) return res.status(401).json({ message: "User not found" });
      if (user.plan !== "free") return res.json({ allowed: true, remainingRuns: -1 });
      if (user.freeTrialRuns >= 3) return res.status(403).json({ allowed: false, remainingRuns: 0, message: "Free trial runs exhausted" });
      const newCount = await storage.incrementFreeTrialRuns(req.session.userId!);
      res.json({ allowed: true, remainingRuns: Math.max(0, 3 - newCount) });
    } catch (err) {
      console.error("Trial run error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post(api.leads.create.path, async (req, res) => {
    try {
      const input = api.leads.create.input.parse(req.body);
      const lead = await storage.createLead(input);
      res.status(201).json(lead);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}
