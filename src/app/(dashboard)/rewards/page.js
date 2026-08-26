"use client";

import { useState, useEffect, useCallback } from "react";
import LevelCard from "../../../components/rewards/LevelCard";
import StreakCard from "../../../components/rewards/StreakCard";
import AchievementsGallery from "../../../components/rewards/AchievementsGallery";
import QuestsList from "../../../components/rewards/QuestsList";
import { getGamificationSummary, getAchievements } from "../../../services/gamification.service";
import { Trophy, Target, Sparkles, RefreshCw } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";

export default function RewardsPage() {
  const { t } = useLanguage();
  const [summary, setSummary] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // all, quests, achievements

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [sumData, achData] = await Promise.all([
        getGamificationSummary(),
        getAchievements(),
      ]);
      setSummary(sumData);
      setAchievements(achData || []);
    } catch (err) {
      console.error("Failed to load gamification data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleClaimSuccess = (claimRes) => {
    if (claimRes?.summary) {
      setSummary(claimRes.summary);
    } else {
      loadData();
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#00685F]">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{t("rewards.page_subtitle", "FINANCIAL DISCIPLINE & REWARDS")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            {t("rewards.page_title", "Pencapaian & Hadiah")}
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            {t("rewards.page_desc", "Kembangkan kebiasaan finansial yang sehat, raih level tertinggi, dan buka lencana bergengsi.")}
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          disabled={isLoading}
          className="self-start sm:self-auto px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl shadow-xs transition-all flex items-center gap-2 text-xs font-bold cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#00685F]" : ""}`} />
          <span>{t("common.refresh", "Segarkan")}</span>
        </button>
      </div>

      {/* Hero Stats Grid: Level Card & Streak Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          <LevelCard data={summary} />
        </div>
        <div className="lg:col-span-1">
          <StreakCard
            streak={summary?.current_streak || 0}
            longestStreak={summary?.longest_streak || 0}
            freezes={summary?.streak_freezes || 0}
          />
        </div>
      </div>

      {/* Main Content: Quests & Achievements */}
      <div className="space-y-8">
        <QuestsList
          quests={summary?.quests || []}
          onClaimSuccess={handleClaimSuccess}
        />

        <AchievementsGallery
          achievements={achievements}
          isLoading={isLoading}
        />
      </div>

    </div>
  );
}
