import { fetchAPI } from "../lib/api";

let cachedSummary = null;
let cachedSummaryTime = 0;
let pendingSummaryPromise = null;

export function invalidateGamificationCache() {
  cachedSummary = null;
  cachedSummaryTime = 0;
}

/**
 * Fetch gamification summary (Level, XP, Streak, Badges, Quests)
 * With 20-second in-memory cache & concurrent request deduplication
 */
export async function getGamificationSummary(force = false) {
  const now = Date.now();
  if (!force && cachedSummary && now - cachedSummaryTime < 20000) {
    return cachedSummary;
  }

  if (pendingSummaryPromise) {
    return pendingSummaryPromise;
  }

  pendingSummaryPromise = fetchAPI("/gamification/summary")
    .then((res) => {
      cachedSummary = res.data;
      cachedSummaryTime = Date.now();
      pendingSummaryPromise = null;
      return res.data;
    })
    .catch((err) => {
      pendingSummaryPromise = null;
      throw err;
    });

  return pendingSummaryPromise;
}

/**
 * Fetch all achievements & user's unlock progress
 */
export async function getAchievements() {
  const res = await fetchAPI("/gamification/achievements");
  return res.data;
}

/**
 * Fetch all active financial quests (daily & weekly)
 */
export async function getQuests() {
  const res = await fetchAPI("/gamification/quests");
  return res.data;
}

/**
 * Claim completed quest reward
 */
export async function claimQuestReward(questId) {
  invalidateGamificationCache();
  const res = await fetchAPI(`/gamification/quests/${questId}/claim`, {
    method: "POST",
  });
  return res;
}
