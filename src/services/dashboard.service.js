import { fetchAPI } from "../lib/api";

/**
 * Fetch dashboard summary data (total balance, income, expense, charts, etc.)
 */
export const getDashboardSummary = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(`/dashboard/summary${query ? `?${query}` : ''}`);
};
