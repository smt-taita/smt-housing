import { useQuery } from "@tanstack/react-query";
import type { CampaignSummary } from "@shared/schema";

export function useCampaignData() {
  return useQuery<CampaignSummary>({
    queryKey: ["/api/campaign/summary"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useRecentDonations() {
  return useQuery({
    queryKey: ["/api/donations/recent"],
    refetchInterval: 60000, // Refresh every minute
  });
}
