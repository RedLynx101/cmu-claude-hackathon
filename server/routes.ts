import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { findMatches } from "./ai";
import { insertClubSchema, type MatchRequest } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all clubs
  app.get("/api/clubs", async (_req, res) => {
    try {
      const clubs = await storage.getAllClubs();
      res.json(clubs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clubs" });
    }
  });

  // Get single club
  app.get("/api/clubs/:id", async (req, res) => {
    try {
      const club = await storage.getClub(req.params.id);
      if (!club) {
        return res.status(404).json({ error: "Club not found" });
      }
      res.json(club);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch club" });
    }
  });

  // Create club
  app.post("/api/clubs", async (req, res) => {
    try {
      const validatedData = insertClubSchema.parse(req.body);
      const club = await storage.createClub(validatedData);
      res.status(201).json(club);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid club data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create club" });
    }
  });

  // Update club
  app.put("/api/clubs/:id", async (req, res) => {
    try {
      const validatedData = insertClubSchema.parse(req.body);
      const club = await storage.updateClub(req.params.id, validatedData);
      if (!club) {
        return res.status(404).json({ error: "Club not found" });
      }
      res.json(club);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid club data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update club" });
    }
  });

  // Find collaboration matches using AI
  app.post("/api/matches", async (req, res) => {
    try {
      const { clubId } = req.body as MatchRequest;
      
      if (!clubId) {
        return res.status(400).json({ error: "clubId is required" });
      }

      const sourceClub = await storage.getClub(clubId);
      if (!sourceClub) {
        return res.status(404).json({ error: "Source club not found" });
      }

      const allClubs = await storage.getAllClubs();
      const matches = await findMatches(sourceClub, allClubs);
      
      res.json(matches);
    } catch (error) {
      console.error("Match generation error:", error);
      res.status(500).json({ error: "Failed to generate matches" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
