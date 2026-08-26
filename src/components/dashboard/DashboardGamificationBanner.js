"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, Zap, Trophy, ArrowRight, Sparkles, Target } from "lucide-react";
import { getGamificationSummary } from "../../services/gamification.service";
import { useLanguage } from "../../context/LanguageContext";

export default function DashboardGamificationBanner() {
  const { t, language } = useLanguage();
  const [data, setData] = useState(null);

  useEffect(() => {
    getGamificationSummary()
      .then((res) => {
        if (res) setData(res);
      })
      .catch(() => {});
  }, []);

  if (!data) return null;

  const level = data.level || 1;
  const streak = data.current_streak || 0;
  const percent = data.progress_percent || 0;
  const rankTitle = language === "en" ? data.rank_title : (data.rank_title_id || data.rank_title);
  const activeDailyQuest = data.quests?.find((q) => !q.is_claimed) || data.quests?.[0];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-[#004d46] to-[#003833] text-white p-5 sm:p-6 rounded-[2rem] shadow-lg border border-emerald-500/20">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-[#00A896]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        
        {/* Left: Level & Streak Info */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-inner shrink-0">
            <Zap className="w-6 h-6 fill-emerald-300" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/20">
                Level {level}
              </span>
              <span className="text-xs font-bold text-slate-300">
                • {rankTitle}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1 text-orange-400">
                <Flame className="w-4 h-4 fill-orange-400" />
                {streak} {t("rewards.days") || "Hari Streak"}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-amber-300 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" />
                {data.unlocked_badges || 0} {t("rewards.badges_unlocked") || "Lencana"}
              </span>
            </div>
          </div>
        </div>

        {/* Center/Right: Quick Quest / Progress */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:border-l md:border-white/10 md:pl-5">
          {activeDailyQuest ? (
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-300 font-extrabold">
                <Target className="w-3.5 h-3.5" />
                <span>{t("rewards.quests_title") || "Misi Hari Ini"}:</span>
              </div>
              <p className="text-slate-200 font-medium max-w-xs truncate">
                {activeDailyQuest.title} (+{activeDailyQuest.xp_reward} XP)
              </p>
            </div>
          ) : (
            <div className="space-y-1 text-xs min-w-[140px]">
              <div className="flex justify-between text-[11px] font-bold text-slate-300">
                <span>XP Level</span>
                <span className="text-emerald-300 font-mono">{percent}%</span>
              </div>
              <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )}

          <Link
            href="/rewards"
            className="self-start sm:self-auto px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shrink-0 group cursor-pointer"
          >
            <span>{t("sidebar.rewards") || "Pencapaian"}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}
