import {
  type Donation,
  type InsertDonation,
  type CampaignData,
  type InsertCampaignData,
  type CampaignSummary,
} from "@shared/schema";
import fs from "fs";
import path from "path";

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
  private donations: Donation[] = [];
  private campaignData: CampaignData;
  private readonly dataFilePath = path.join(process.cwd(), "campaign-data.json");
  private readonly donationsFilePath = path.join(process.cwd(), "donations.json");

  constructor() {
    // Load existing data from files or use defaults
    this.donations = this.loadDonations();
    this.campaignData = this.loadCampaignData();
  }

  private loadCampaignData(): CampaignData {
    try {
      if (fs.existsSync(this.dataFilePath)) {
        const fileContent = fs.readFileSync(this.dataFilePath, "utf-8");
        const data = JSON.parse(fileContent);
        
        // Convert date strings back to Date objects
        return {
          ...data,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          lastUpdated: new Date(data.lastUpdated),
        };
      }
    } catch (error) {
      console.error("Error loading campaign data from file:", error);
    }

    // Return default data if file doesn't exist or can't be read
    return {
      id: "main",
      goal: 24000,
      currency: "NZD",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2025-12-31"),
      totalRaised: 10000,
      onlineTotal: 0,
      offlineTotal: 0,
      donorCount: 0,
      monthlyCommitments: 0,
      lastUpdated: new Date(),
    };
  }

  private saveCampaignData(): void {
    try {
      const dataToSave = JSON.stringify(this.campaignData, null, 2);
      fs.writeFileSync(this.dataFilePath, dataToSave, "utf-8");
    } catch (error) {
      console.error("Error saving campaign data to file:", error);
    }
  }

  private loadDonations(): Donation[] {
    try {
      if (fs.existsSync(this.donationsFilePath)) {
        const fileContent = fs.readFileSync(this.donationsFilePath, "utf-8");
        const data = JSON.parse(fileContent);
        
        // Convert date strings back to Date objects
        return data.map((donation: any) => ({
          ...donation,
          createdAt: new Date(donation.createdAt),
          dateReceived: new Date(donation.dateReceived),
        }));
      }
    } catch (error) {
      console.error("Error loading donations from file:", error);
    }
    
    return [];
  }

  private saveDonations(): void {
    try {
      const dataToSave = JSON.stringify(this.donations, null, 2);
      fs.writeFileSync(this.donationsFilePath, dataToSave, "utf-8");
    } catch (error) {
      console.error("Error saving donations to file:", error);
    }
  }

  // Donation methods
  async createDonation(donation: InsertDonation): Promise<Donation> {
    const newDonation: Donation = {
      ...donation,
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date(),
      dateReceived: donation.dateReceived || new Date(),
    };
    
    this.donations.push(newDonation);
    this.saveDonations();
    await this.updateCampaignProgress();
    return newDonation;
  }

  async getDonations(): Promise<Donation[]> {
    return [...this.donations].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getDonationById(id: string): Promise<Donation | undefined> {
    return this.donations.find(d => d.id === id);
  }

  async getRecentDonations(limit: number = 10): Promise<Donation[]> {
    return this.donations
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  // Campaign data methods
  async getCampaignData(): Promise<CampaignData> {
    return { ...this.campaignData };
  }

  async updateCampaignData(data: Partial<InsertCampaignData>): Promise<CampaignData> {
    this.campaignData = {
      ...this.campaignData,
      ...data,
      lastUpdated: new Date(),
    };
    
    // Save to file immediately after updating
    this.saveCampaignData();
    
    return { ...this.campaignData };
  }

  async getCampaignSummary(): Promise<CampaignSummary> {
    const data = await this.getCampaignData();
    const now = new Date();
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysRemaining = Math.max(0, Math.ceil((data.endDate.getTime() - now.getTime()) / msPerDay));
    
    return {
      goal: data.goal,
      totalRaised: data.totalRaised,
      donorCount: data.donorCount,
      monthlyCommitments: data.monthlyCommitments,
      progressPercentage: Math.round((data.totalRaised / data.goal) * 100),
      daysRemaining,
    };
  }

  // Admin methods
  async updateCampaignProgress(): Promise<void> {
    const totalRaised = this.donations.reduce((sum, donation) => sum + Number(donation.amount), 0);
    const donorCount = new Set(this.donations.filter(d => !d.anonymous).map(d => d.donorEmail)).size;
    
    this.campaignData.totalRaised = totalRaised;
    this.campaignData.donorCount = donorCount;
    this.campaignData.lastUpdated = new Date();
    
    // Save campaign data after updating progress
    this.saveCampaignData();
  }
}

// Export a singleton instance
export const storage = new MemStorage();