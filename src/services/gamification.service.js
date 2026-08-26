import { fetchAPI } from "../lib/api";

/**
 * Fetch gamification summary (Level, XP, Streak, Badges, Quests)
 */
export async function getGamificationSummary() {
  const res = await fetchAPI("/gamification/summary");
  return res.data;
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
  const res = await fetchAPI(`/gamification/quests/${questId}/claim`, {
    method: "POST",
  });
  return res;
}
