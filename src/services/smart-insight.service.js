import { fetchAPI } from "../lib/api";

/**
 * Get contextual smart insight for a specific page.
 * Dual-mode: AI-powered if user has AI enabled, deterministic otherwise.
 * @param {'dashboard'|'categories'|'budgets'|'accounts'|'goals'} page
 */
export async function getSmartInsight(page) {
  return fetchAPI(`/smart-insights/${page}`);
}
