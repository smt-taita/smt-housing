// Minimal API handler for Vercel serverless functions
// Only handles contact form and newsletter if email is configured

export default function handler(req, res) {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  // Campaign data endpoint - return hardcoded data
  if (pathname === '/api/campaign/summary' || pathname === '/api/campaign/data') {
    return res.status(200).json({
      id: "main",
      goal: 24000,
      currency: "NZD",
      totalRaised: 18500,
      donorCount: 0,
      monthlyCommitments: 0,
      progressPercentage: Math.round((18500 / 24000) * 100),
      daysRemaining: Math.max(0, Math.ceil((new Date('2025-12-31') - new Date()) / (24 * 60 * 60 * 1000))),
      startDate: "2024-01-01T00:00:00.000Z",
      endDate: "2025-12-31T00:00:00.000Z",
      lastUpdated: new Date().toISOString()
    });
  }

  // For now, return 404 for other endpoints
  // Add contact form / newsletter handlers here if needed
  res.status(404).json({ message: 'Endpoint not found' });
}
