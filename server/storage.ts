import { type Donation, type InsertDonation, type CampaignData, type InsertCampaignData, type CampaignSummary } from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { eq, sql } from "drizzle-orm";
import { donations, campaignData } from "@shared/db/schema"; // Assuming schema is in @shared/db/schema

export interface IStorage {
  // Donation methods
  createDonation(donation: InsertDonation): Promise<Donation>;
  getDonations(): Promise<Donation[]>;
  getDonationById(id: string): Promise<Donation | undefined>;
  getRecentDonations(limit?: number): Promise<Donation[]>;

  // Campaign data methods
  getCampaignData(): Promise<CampaignData>;
  updateCampaignData(data: Partial<InsertCampaignData>): Promise<CampaignData>;
  getCampaignSummary(): Promise<CampaignSummary>;

  // Admin methods
  updateCampaignProgress(): Promise<void>;
}

// Mocking a database connection for demonstration purposes.
// In a real Replit environment, you would use the Replit database SDK.
// For example:
// import Database from '@replit/database';
// const db = new Database();
// const sqliteDb = new Database({ path: ":memory:" }); // Use :memory: for testing without Replit DB
// const pgDb = postgres({
//   host: process.env.PGHOST,
//   port: parseInt(process.env.PGPORT || "5432"),
//   database: process.env.PGDATABASE,
//   username: process.env.PGUSER,
//   password: process.env.PGPASSWORD,
// });

// Using a placeholder for the database connection.
// Replace this with your actual Drizzle database instance.
// For example, if using Drizzle with PostgreSQL:
// import postgres from 'postgres';
// const pgClient = postgres({ ... }); // configure your connection
// const db = drizzle(pgClient, { schema });
// For example, if using Drizzle with SQLite:
// import Database from 'better-sqlite3';
// const sqliteClient = new Database(':memory:'); // or path to your DB file
// const db = drizzle(sqliteClient, { schema });

// Placeholder for Drizzle DB instance. Replace with your actual DB setup.
let db: BetterSQLite3Database | null = null;

// Function to initialize the database connection
export const initializeDatabase = async () => {
  if (!db) {
    // Example using SQLite in-memory for demonstration.
    // Replace with your actual database initialization (e.g., PostgreSQL).
    const sqliteClient = new Database(':memory:');
    db = drizzle(sqliteClient, { schema: { donations, campaignData } });

    // Initialize campaign data if it doesn't exist
    const existingCampaignData = await db.query.campaignData.findFirst();
    if (!existingCampaignData) {
      await db.insert(campaignData).values({
        id: "main",
        goal: "24000.00",
        currency: "NZD",
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-09-30"),
        totalRaised: "0.00",
        onlineTotal: "0.00",
        offlineTotal: "0.00",
        donorCount: 0,
        monthlyCommitments: "0.00",
        lastUpdated: new Date(),
      });
    }
  }
};

export class PostgresStorage implements IStorage {
  private db: BetterSQLite3Database;

  constructor(database: BetterSQLite3Database) {
    this.db = database;
  }

  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const id = randomUUID();
    const donation: Donation = {
      ...insertDonation,
      id,
      createdAt: new Date(),
      dateReceived: insertDonation.dateReceived || new Date(),
      message: insertDonation.message || null,
      donorName: insertDonation.donorName || null,
      donorEmail: insertDonation.donorEmail || null,
      donorPhone: insertDonation.donorPhone || null,
      notes: insertDonation.notes || null,
      anonymous: insertDonation.anonymous || false,
      receiveUpdates: insertDonation.receiveUpdates || true,
    };

    await this.db.insert(donations).values(donation);

    // Update campaign data after a new donation
    await this.updateCampaignProgress();

    return donation;
  }

  async getDonations(): Promise<Donation[]> {
    return this.db.query.donations.findMany({
      orderBy: (d, { desc }) => desc(d.dateReceived),
    });
  }

  async getDonationById(id: string): Promise<Donation | undefined> {
    return this.db.query.donations.findFirst({
      where: eq(donations.id, id),
    });
  }

  async getRecentDonations(limit: number = 10): Promise<Donation[]> {
    return this.db.query.donations.findMany({
      orderBy: (d, { desc }) => desc(d.dateReceived),
      limit: limit,
    });
  }

  async getCampaignData(): Promise<CampaignData> {
    const data = await this.db.query.campaignData.findFirst({
      where: eq(campaignData.id, "main"),
    });
    if (!data) {
      throw new Error("Campaign data not found");
    }
    return data;
  }

  async updateCampaignData(data: Partial<InsertCampaignData>): Promise<CampaignData> {
    const [updated] = await this.db
      .update(campaignData)
      .set({
        ...data,
        lastUpdated: new Date(),
      })
      .where(eq(campaignData.id, "main"))
      .returning();

    return updated;
  }

  async getCampaignSummary(): Promise<CampaignSummary> {
    const data = await this.getCampaignData();
    const goal = parseFloat(data.goal);
    const totalRaised = parseFloat(data.totalRaised);
    const monthlyCommitments = parseFloat(data.monthlyCommitments);

    // Calculate days remaining
    const today = new Date();
    const endDate = new Date(data.endDate);
    const timeDiff = endDate.getTime() - today.getTime();
    const daysRemaining = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));

    return {
      goal,
      totalRaised,
      donorCount: data.donorCount,
      monthlyCommitments,
      progressPercentage: goal > 0 ? Math.round((totalRaised / goal) * 100) : 0,
      daysRemaining,
    };
  }

  async updateCampaignProgress(): Promise<void> {
    // Get aggregated data from donations table
    const result = await this.db
      .select({
        totalRaised: sql<number>`COALESCE(SUM(CAST(${donations.amount} AS DECIMAL)), 0)`,
        onlineTotal: sql<number>`COALESCE(SUM(CASE WHEN ${donations.source} = 'online' THEN CAST(${donations.amount} AS DECIMAL) ELSE 0 END), 0)`,
        offlineTotal: sql<number>`COALESCE(SUM(CASE WHEN ${donations.source} = 'offline' THEN CAST(${donations.amount} AS DECIMAL) ELSE 0 END), 0)`,
        donorCount: sql<number>`COUNT(*)`,
        monthlyCommitments: sql<number>`COALESCE(SUM(CASE WHEN ${donations.frequency} = 'monthly' THEN CAST(${donations.amount} AS DECIMAL) ELSE 0 END), 0)`,
      })
      .from(donations);

    const stats = result[0];

    await this.db
      .update(campaignData)
      .set({
        totalRaised: stats.totalRaised.toFixed(2),
        onlineTotal: stats.onlineTotal.toFixed(2),
        offlineTotal: stats.offlineTotal.toFixed(2),
        donorCount: stats.donorCount,
        monthlyCommitments: stats.monthlyCommitments.toFixed(2),
        lastUpdated: new Date(),
      })
      .where(eq(campaignData.id, "main"));
  }
}

// Initialize DB and create storage instance
let storageInstance: IStorage;

export const getStorage = async (): Promise<IStorage> => {
  if (!storageInstance) {
    await initializeDatabase();
    // Make sure db is not null before using it
    if (db) {
      storageInstance = new PostgresStorage(db);
    } else {
      throw new Error("Database not initialized");
    }
  }
  return storageInstance;
};

// Exporting the MemStorage for fallback or testing if needed
export const memoryStorage = new MemStorage();

// Placeholder for the actual storage instance, which will be initialized asynchronously.
// You should use getStorage() to get the storage instance.
export const storage: IStorage = memoryStorage; // Default to memory storage

// Keep the original MemStorage class for reference or potential fallback
class MemStorage implements IStorage {
  private donations: Map<string, Donation>;
  private campaignData: CampaignData;

  constructor() {
    this.donations = new Map();

    // Initialize campaign data with realistic starting values
    this.campaignData = {
      id: "main",
      goal: "24000.00",
      currency: "NZD",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-09-30"),
      totalRaised: "2500.00", // Updated to reflect current progress
      onlineTotal: "0.00",
      offlineTotal: "0.00",
      donorCount: 0, // Set initial donorCount to 0
      monthlyCommitments: "0.00",
      lastUpdated: new Date(),
    };
  }

  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const id = randomUUID();
    const donation: Donation = {
      ...insertDonation,
      id,
      createdAt: new Date(),
      dateReceived: insertDonation.dateReceived || new Date(),
      message: insertDonation.message || null,
      donorName: insertDonation.donorName || null,
      donorEmail: insertDonation.donorEmail || null,
      donorPhone: insertDonation.donorPhone || null,
      notes: insertDonation.notes || null,
      anonymous: insertDonation.anonymous || false,
      receiveUpdates: insertDonation.receiveUpdates || true,
    };

    this.donations.set(id, donation);

    // Update campaign data
    await this.updateCampaignProgress();

    return donation;
  }

  async getDonations(): Promise<Donation[]> {
    return Array.from(this.donations.values()).sort(
      (a, b) => (b.dateReceived?.getTime() || 0) - (a.dateReceived?.getTime() || 0)
    );
  }

  async getDonationById(id: string): Promise<Donation | undefined> {
    return this.donations.get(id);
  }

  async getRecentDonations(limit: number = 10): Promise<Donation[]> {
    const donations = await this.getDonations();
    return donations.slice(0, limit);
  }

  async getCampaignData(): Promise<CampaignData> {
    return { ...this.campaignData };
  }

  async updateCampaignData(data: Partial<InsertCampaignData>): Promise<CampaignData> {
    this.campaignData = {
      ...this.campaignData,
      ...data,
      lastUpdated: new Date(),
    };
    return { ...this.campaignData };
  }

  async getCampaignSummary(): Promise<CampaignSummary> {
    const goal = parseFloat(this.campaignData.goal || "0");
    const totalRaised = parseFloat(this.campaignData.totalRaised || "0");
    const monthlyCommitments = parseFloat(this.campaignData.monthlyCommitments || "0");
    const progressPercentage = Math.round((totalRaised / goal) * 100);

    // Calculate days remaining until end date
    const now = new Date();
    const endDate = new Date(this.campaignData.endDate);
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    return {
      goal,
      totalRaised,
      donorCount: this.campaignData.donorCount || 0,
      monthlyCommitments,
      progressPercentage,
      daysRemaining,
    };
  }

  async updateCampaignProgress(): Promise<void> {
    const donations = await this.getDonations();

    let totalRaised = 0;
    let onlineTotal = 0;
    let offlineTotal = 0;
    let monthlyCommitments = 0;

    donations.forEach(donation => {
      const amount = parseFloat(donation.amount);
      totalRaised += amount;

      if (donation.source === "online") {
        onlineTotal += amount;
      } else {
        offlineTotal += amount;
      }

      if (donation.frequency === "monthly") {
        monthlyCommitments += amount;
      }
    });

    this.campaignData = {
      ...this.campaignData,
      totalRaised: totalRaised.toFixed(2),
      onlineTotal: onlineTotal.toFixed(2),
      offlineTotal: offlineTotal.toFixed(2),
      donorCount: donations.length,
      monthlyCommitments: monthlyCommitments.toFixed(2),
      lastUpdated: new Date(),
    };
  }
}