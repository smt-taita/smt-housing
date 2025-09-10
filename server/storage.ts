import {
  type Donation,
  type InsertDonation,
  type CampaignData,
  type InsertCampaignData,
  type CampaignSummary,
  type ContactSubmission,
  type InsertContactSubmission,
  donations,
  campaignData,
  contactSubmissions
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

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

  // Contact submission methods
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  getContactSubmissionById(id: string): Promise<ContactSubmission | undefined>;
  updateContactSubmissionStatus(id: string, status: "new" | "contacted" | "converted" | "declined", notes?: string): Promise<ContactSubmission>;

  // Admin methods
  updateCampaignProgress(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Donation methods
  async createDonation(donation: InsertDonation): Promise<Donation> {
    const [created] = await db.insert(donations).values(donation).returning();
    await this.updateCampaignProgress();
    return created;
  }

  async getDonations(): Promise<Donation[]> {
    return await db.select().from(donations).orderBy(desc(donations.createdAt));
  }

  async getDonationById(id: string): Promise<Donation | undefined> {
    const [donation] = await db.select().from(donations).where(eq(donations.id, id));
    return donation;
  }

  async getRecentDonations(limit: number = 10): Promise<Donation[]> {
    return await db.select().from(donations)
      .orderBy(desc(donations.createdAt))
      .limit(limit);
  }

  // Campaign data methods
  async getCampaignData(): Promise<CampaignData> {
    let [data] = await db.select().from(campaignData).where(eq(campaignData.id, "main"));

    if (!data) {
      // Initialize default campaign data
      [data] = await db.insert(campaignData).values({
        id: "main",
        goal: "24000.00",
        currency: "NZD",
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-10-31"),
        totalRaised: "10000.00",
        onlineTotal: "0.00",
        offlineTotal: "10000.00",
        donorCount: 5,
        monthlyCommitments: "0.00",
      }).returning();
    }

    return data;
  }

  async updateCampaignData(data: Partial<InsertCampaignData>): Promise<CampaignData> {
    const [updated] = await db.update(campaignData)
      .set({ ...data, lastUpdated: new Date() })
      .where(eq(campaignData.id, "main"))
      .returning();

    return updated;
  }

  async getCampaignSummary(): Promise<CampaignSummary> {
    const data = await this.getCampaignData();

    const goal = parseFloat(data.goal);
    const totalRaised = parseFloat(data.totalRaised || "0");
    const progressPercentage = Math.round((totalRaised / goal) * 100);

    // Calculate days remaining
    const now = new Date();
    const endDate = new Date(data.endDate);
    const timeDiff = endDate.getTime() - now.getTime();
    const daysRemaining = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));

    return {
      goal,
      totalRaised,
      donorCount: data.donorCount || 0,
      monthlyCommitments: parseFloat(data.monthlyCommitments || "0"),
      progressPercentage,
      daysRemaining,
    };
  }

  // Contact submission methods
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const [created] = await db.insert(contactSubmissions).values(submission).returning();
    return created;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.submittedAt));
  }

  async getContactSubmissionById(id: string): Promise<ContactSubmission | undefined> {
    const [submission] = await db.select().from(contactSubmissions).where(eq(contactSubmissions.id, id));
    return submission;
  }

  async updateContactSubmissionStatus(
    id: string,
    status: "new" | "contacted" | "converted" | "declined",
    notes?: string
  ): Promise<ContactSubmission> {
    const updateData: any = { status };
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const [updated] = await db.update(contactSubmissions)
      .set(updateData)
      .where(eq(contactSubmissions.id, id))
      .returning();

    return updated;
  }

  // Admin methods
  async updateCampaignProgress(): Promise<void> {
    const allDonations = await this.getDonations();

    const totalRaised = allDonations.reduce((sum, donation) => {
      return sum + parseFloat(donation.amount);
    }, 0);

    const onlineTotal = allDonations
      .filter(d => d.source === "online")
      .reduce((sum, donation) => sum + parseFloat(donation.amount), 0);

    const offlineTotal = allDonations
      .filter(d => d.source === "offline")
      .reduce((sum, donation) => sum + parseFloat(donation.amount), 0);

    const monthlyCommitments = allDonations
      .filter(d => d.frequency === "monthly")
      .reduce((sum, donation) => sum + parseFloat(donation.amount), 0) * 12;

    const donorCount = allDonations.length;

    await this.updateCampaignData({
      totalRaised: totalRaised.toFixed(2),
      onlineTotal: onlineTotal.toFixed(2),
      offlineTotal: offlineTotal.toFixed(2),
      monthlyCommitments: monthlyCommitments.toFixed(2),
      donorCount,
    });
  }
}

export const storage = new DatabaseStorage();