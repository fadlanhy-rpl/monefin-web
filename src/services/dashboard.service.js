import { fetchAPI } from "../lib/api";

/**
 * Fetch dashboard summary data (total balance, income, expense, charts, etc.)
 * Dilengkapi dengan 25s in-memory SWR micro-cache & in-flight deduplication
 */
export const getDashboardSummary = async (params = {}, force = false) => {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(`/dashboard/summary${query ? `?${query}` : ''}`, {
    cacheTtl: 25000,
    forceRefresh: force,
  });
};

