import { z } from "zod";

// Donation types and schemas
export const insertDonationSchema = z.object({
  amount: z.number().positive(),
  frequency: z.enum(["monthly", "annual", "one-time"]),
  source: z.enum(["online", "offline"]),
  donorName: z.string().optional(),
  donorEmail: z.string().email().optional(),
  donorPhone: z.string().optional(),
  message: z.string().optional(),
  anonymous: z.boolean().default(false),
  receiveUpdates: z.boolean().default(true),
  dateReceived: z.date().optional(),
  notes: z.string().optional(),
});

export const insertCampaignDataSchema = z.object({
  goal: z.number().positive().default(24000),
  currency: z.string().default("NZD"),
  startDate: z.date(),
  endDate: z.date(),
  totalRaised: z.number().default(0),
  onlineTotal: z.number().default(0),
  offlineTotal: z.number().default(0),
  donorCount: z.number().int().default(0),
  monthlyCommitments: z.number().default(0),
});

export const insertContactSubmissionSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  amount: z.number().positive().optional(),
  frequency: z.enum(["monthly", "annual", "one-time"]).optional(),
  message: z.string().optional(),
  status: z.enum(["new", "contacted", "converted", "declined"]).default("new"),
  notes: z.string().optional(),
});

export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = InsertDonation & {
  id: string;
  createdAt: Date;
};

export type InsertCampaignData = z.infer<typeof insertCampaignDataSchema>;
export type CampaignData = InsertCampaignData & {
  id: string;
  lastUpdated: Date;
};

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = InsertContactSubmission & {
  id: string;
  submittedAt: Date;
};

// Campaign summary type for frontend
export const campaignSummarySchema = z.object({
  goal: z.number(),
  totalRaised: z.number(),
  donorCount: z.number(),
  monthlyCommitments: z.number(),
  progressPercentage: z.number(),
  daysRemaining: z.number(),
});

export type CampaignSummary = z.infer<typeof campaignSummarySchema>;