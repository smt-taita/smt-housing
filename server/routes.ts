import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { emailService } from "./email";
import { insertDonationSchema, insertCampaignDataSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get campaign summary
  app.get("/api/campaign/summary", async (req, res) => {
    try {
      const summary = await storage.getCampaignSummary();
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaign summary" });
    }
  });

  // Get campaign data
  app.get("/api/campaign", async (req, res) => {
    try {
      const campaignData = await storage.getCampaignData();
      res.json(campaignData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaign data" });
    }
  });

  // Update campaign data (admin only)
  app.patch("/api/campaign", async (req, res) => {
    try {
      const validatedData = insertCampaignDataSchema.partial().parse(req.body);
      const updatedData = await storage.updateCampaignData(validatedData);
      res.json(updatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid campaign data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update campaign data" });
      }
    }
  });

  // Create donation
  app.post("/api/donations", async (req, res) => {
    try {
      const validatedDonation = insertDonationSchema.parse(req.body);
      const donation = await storage.createDonation(validatedDonation);
      res.status(201).json(donation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid donation data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create donation" });
      }
    }
  });

  // Get all donations (admin only)
  app.get("/api/donations", async (req, res) => {
    try {
      const donations = await storage.getDonations();
      res.json(donations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch donations" });
    }
  });

  // Get recent donations (public, limited data)
  app.get("/api/donations/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const donations = await storage.getRecentDonations(limit);
      
      // Return limited public data
      const publicDonations = donations.map(donation => ({
        id: donation.id,
        amount: donation.amount,
        frequency: donation.frequency,
        donorName: donation.anonymous ? "Anonymous" : donation.donorName,
        dateReceived: donation.dateReceived,
      }));
      
      res.json(publicDonations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent donations" });
    }
  });

  // Newsletter signup
  app.post("/api/newsletter/signup", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || !email.includes("@")) {
        return res.status(400).json({ message: "Valid email required" });
      }
      
      // Send welcome email
      const emailSent = await emailService.sendNewsletterWelcome(email);
      
      if (emailSent) {
        res.json({ message: "Successfully subscribed to newsletter" });
      } else {
        res.status(500).json({ message: "Failed to subscribe - please try again" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  // Contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, message } = req.body;
      
      if (!name || !email || !message) {
        return res.status(400).json({ message: "Name, email, and message are required" });
      }
      
      // Send email notification
      const emailSent = await emailService.sendContactFormNotification({ name, email, message });
      
      if (emailSent) {
        res.json({ message: "Message sent successfully" });
      } else {
        res.status(500).json({ message: "Failed to send message - please try again" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
