import { type Donation, type InsertDonation, type CampaignData, type InsertCampaignData, type CampaignSummary } from "@shared/schema";
import { randomUUID } from "crypto";

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

export class MemStorage implements IStorage {
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
      totalRaised: "2880.00",
      onlineTotal: "1440.00",
      offlineTotal: "1440.00",
      donorCount: 24,
      monthlyCommitments: "1440.00",
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

export const storage = new MemStorage();
