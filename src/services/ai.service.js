import { fetchAPI } from "../lib/api";

/** Send a chat message to the AI Financial Advisor. */
export async function aiChat(message, history = []) {
  return fetchAPI("/ai/chat", { method: "POST", body: { message, history } });
}

/** Suggest a category for a transaction description. */
export async function aiSuggestCategory(description, type = "expense") {
  return fetchAPI("/ai/suggest-category", { method: "POST", body: { description, type } });
}

/** Get AI-generated budget recommendations based on 3-month history. */
export async function aiBudgetRecommendations() {
  return fetchAPI("/ai/budget-recommendations");
}

/** Get financial health score and insights (always deterministic). */
export async function aiInsights() {
  return fetchAPI("/ai/insights");
}

/** Test the AI provider connection (can pass current input credentials or use saved prefs). */
export async function testAiConnection(payload = null) {
  if (payload) {
    return fetchAPI("/ai/test-connection", { method: "POST", body: payload });
  }
  return fetchAPI("/ai/test-connection");
}

/** Get supported providers and their models for UI dropdowns. */
export async function getAiProviders() {
  return fetchAPI("/ai/providers");
}

/**
 * Reveal the full encrypted API key after password verification.
 * @param {string} password - User's account password for re-auth
 */
export async function revealAiKey(password) {
  return fetchAPI("/ai/reveal-key", { method: "POST", body: { password } });
}

/**
 * Save AI provider configuration.
 * @param {{ ai_enabled: boolean, provider: string, model: string, api_key: string }} config
 */
export async function saveAiConfig(config) {
  return fetchAPI("/ai/save-config", { method: "POST", body: config });
}
