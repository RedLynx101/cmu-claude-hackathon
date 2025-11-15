import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const clubs = pgTable("clubs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  goals: text("goals").array().notNull(),
  offerings: text("offerings").array().notNull(),
  needs: text("needs").array().notNull(),
  categories: text("categories").array().notNull(),
  icon: text("icon").notNull(),
});

export const insertClubSchema = createInsertSchema(clubs).omit({
  id: true,
});

export type InsertClub = z.infer<typeof insertClubSchema>;
export type Club = typeof clubs.$inferSelect;

export interface Match {
  club: Club;
  matchScore: number;
  reasoning: string;
  collaborationIdeas: string[];
  proposal: string;
  outreachMessage: string;
}

export interface MatchRequest {
  clubId: string;
}
