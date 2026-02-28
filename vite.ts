import { db } from "./db";
import { leads, users, type InsertLead, type Lead, type User } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  createLead(lead: InsertLead): Promise<Lead>;
  createUser(email: string, passwordHash: string): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  incrementFreeTrialRuns(userId: number): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values(insertLead).returning();
    return lead;
  }

  async createUser(email: string, passwordHash: string): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({ email, passwordHash })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async incrementFreeTrialRuns(userId: number): Promise<number> {
    const [updated] = await db
      .update(users)
      .set({ freeTrialRuns: sql`${users.freeTrialRuns} + 1` })
      .where(eq(users.id, userId))
      .returning({ freeTrialRuns: users.freeTrialRuns });
    return updated.freeTrialRuns;
  }
}

export const storage = new DatabaseStorage();
