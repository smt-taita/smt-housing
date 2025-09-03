import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const donations = pgTable("donations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  frequency: text("frequency", { enum: ["monthly", "annual", "one-time"] }).notNull(),
  source: text("source", { enum: ["online", "offline"] }).notNull(),
  donorName: text("donor_name"),
  donorEmail: text("donor_email"),
  donorPhone: text("donor_phone"),
  message: text("message"),
  anonymous: boolean("anonymous").default(false),
  receiveUpdates: boolean("receive_updates").default(true),
  dateReceived: timestamp("date_received").defaultNow(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const campaignData = pgTable("campaign_data", {
  id: varchar("id").primaryKey().default("main"),
  goal: decimal("goal", { precision: 10, scale: 2 }).notNull().default("24000"),
  currency: text("currency").notNull().default("NZD"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  totalRaised: decimal("total_raised", { precision: 10, scale: 2 }).default("0"),
  onlineTotal: decimal("online_total", { precision: 10, scale: 2 }).default("0"),
  offlineTotal: decimal("offline_total", { precision: 10, scale: 2 }).default("0"),
  donorCount: integer("donor_count").default(0),
  monthlyCommitments: decimal("monthly_commitments", { precision: 10, scale: 2 }).default("0"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  frequency: text("frequency", { enum: ["monthly", "annual", "one-time"] }),
  message: text("message"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  status: text("status", { enum: ["new", "contacted", "converted", "declined"] }).default("new"),
  notes: text("notes"),
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  createdAt: true,
});

export const insertCampaignDataSchema = createInsertSchema(campaignData).omit({
  id: true,
  lastUpdated: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  submittedAt: true,
});

export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donations.$inferSelect;
export type InsertCampaignData = z.infer<typeof insertCampaignDataSchema>;
export type CampaignData = typeof campaignData.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

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
