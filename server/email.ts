
import nodemailer from 'nodemailer';

interface EmailConfig {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Using Gmail SMTP - you'll need to set up app password
    this.transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your gmail address
        pass: process.env.EMAIL_APP_PASSWORD, // gmail app password
      },
    });
  }

  async sendEmail({ to, subject, html, from }: EmailConfig): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: from || process.env.EMAIL_USER,
        to,
        subject,
        html,
      });
      return true;
    } catch (error) {
      console.error('Email send failed:', error);
      return false;
    }
  }

  async sendContactFormNotification(contactData: {
    name: string;
    email: string;
    message: string;
  }): Promise<boolean> {
    const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${contactData.name}</p>
      <p><strong>Email:</strong> ${contactData.email}</p>
      <p><strong>Message:</strong></p>
      <p>${contactData.message.replace(/\n/g, '<br>')}</p>
    `;

    return this.sendEmail({
      to: process.env.ADMIN_EMAIL || 'housing@stmattstaita.org.nz',
      subject: 'New Contact Form Submission - St Matt\'s Kāinga',
      html,
    });
  }

  async sendDonationNotification(donationData: {
    amount: string;
    donorName?: string;
    donorEmail?: string;
    frequency: string;
  }): Promise<boolean> {
    const html = `
      <h2>New Donation Received</h2>
      <p><strong>Amount:</strong> $${donationData.amount} NZD</p>
      <p><strong>Frequency:</strong> ${donationData.frequency}</p>
      <p><strong>Donor:</strong> ${donationData.donorName || 'Anonymous'}</p>
      ${donationData.donorEmail ? `<p><strong>Email:</strong> ${donationData.donorEmail}</p>` : ''}
    `;

    return this.sendEmail({
      to: process.env.ADMIN_EMAIL || 'housing@stmattstaita.org.nz',
      subject: 'New Donation - St Matt\'s Kāinga',
      html,
    });
  }

  async sendNewsletterWelcome(email: string): Promise<boolean> {
    const html = `
      <h2>Welcome to St Matt's Kāinga Updates</h2>
      <p>Thank you for subscribing to receive quarterly updates on our housing project progress.</p>
      <p>You'll receive updates on:</p>
      <ul>
        <li>Fundraising progress</li>
        <li>Resident stories and community impact</li>
        <li>Project milestones and developments</li>
      </ul>
      <p>Thank you for supporting affordable housing in our community!</p>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Welcome to St Matt\'s Kāinga Updates',
      html,
    });
  }
}

export const emailService = new EmailService();
