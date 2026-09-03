"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, Zap, Trophy, ArrowRight, Sparkles, Target, Shield, CheckCircle2 } from "lucide-react";
import { getGamificationSummary } from "../../services/gamification.service";
import { useLanguage } from "../../context/LanguageContext";
import { getLocalizedQuest } from "../../lib/gamificationDictionary";

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
  const xpInLevel = data.xp_in_current_level || 0;
  const xpNeeded = data.xp_needed_for_next || 150;
  const rankTitle = language === "en" ? data.rank_title : (data.rank_title_id || data.rank_title);
  
  // Find first actionable (unclaimed) quest
  const questList = Array.isArray(data.quests) ? data.quests : (data.quests ? Object.values(data.quests) : []);
  const activeQuest = questList.find((q) => !q.is_claimed) || questList[0];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-white border border-emerald-100/90 hover:border-emerald-200/90 rounded-[1.75rem] p-4 sm:p-5 shadow-[0_4px_20px_-4px_rgba(0,104,95,0.06)] hover:shadow-[0_8px_30px_-4px_rgba(0,104,95,0.12)] transition-all duration-300 group">
      
      {/* Ambient background decoration */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-16 w-40 h-40 bg-teal-200/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5">
        
        {/* LEFT: Level Badge + Rank Title + XP Bar */}
        <div className="flex items-center gap-3.5 sm:gap-4 shrink-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#00685F] to-[#00A896] flex items-center justify-center text-white shadow-md shadow-emerald-700/20 shrink-0 group-hover:scale-105 transition-transform duration-300">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#00685F] text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                Level {level}
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-800 tracking-tight">
                {rankTitle}
              </span>
            </div>

            {/* XP mini progress bar */}
            <div className="flex items-center gap-2.5">
              <div className="w-28 sm:w-36 h-2 bg-slate-200/80 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#00685F] to-[#00A896] rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-slate-500 font-mono">
                {xpInLevel}/{xpNeeded} XP ({percent}%)
              </span>
            </div>
          </div>
        </div>

        {/* CENTER: Interactive Streak & Badges Stats */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 py-2 lg:py-0 border-y lg:border-y-0 lg:border-x border-emerald-100/70 lg:px-6">
          {/* Streak Flame Pill */}
          <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200/80 text-orange-600 px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs hover:scale-105 transition-transform">
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
            <span>{streak} {t("rewards.days", "Hari")} Streak</span>
          </div>

          {/* Badges Count Pill */}
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 text-amber-800 px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs hover:scale-105 transition-transform">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>{data.unlocked_badges || 0} {t("rewards.badges_unlocked", "Lencana")}</span>
          </div>

          {/* Saver Shield Pill */}
          <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 text-[#00685F] px-2.5 py-1.5 rounded-xl font-bold text-xs shadow-xs">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>{data.streak_freezes || 0} Shield</span>
          </div>
        </div>

        {/* RIGHT: Active Mission & CTA Button */}
        <div className="flex items-center justify-between lg:justify-end gap-3 sm:gap-4 shrink-0">
          {activeQuest && (() => {
            const localizedQuest = getLocalizedQuest(activeQuest, language);
            return (
              <div className="hidden md:flex flex-col items-start text-xs max-w-[200px] xl:max-w-xs">
                <div className="flex items-center gap-1.5 text-[#00685F] font-extrabold text-[11px] uppercase tracking-wider">
                  <Target className="w-3 h-3 text-emerald-600" />
                  <span>{t("rewards.quests_title", "Misi Aktif")}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                    +{activeQuest.xp_reward} XP
                  </span>
                </div>
                <span className="text-slate-600 font-medium truncate w-full mt-0.5">
                  {localizedQuest.title}
                </span>
              </div>
            );
          })()}

          <Link
            href="/rewards"
            className="w-full sm:w-auto px-4 py-2.5 bg-[#00685F] hover:bg-[#00554E] text-white rounded-xl font-extrabold text-xs shadow-sm hover:shadow-md hover:shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 group/btn cursor-pointer shrink-0"
          >
            <span>{t("sidebar.rewards", "Pencapaian & Hadiah")}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}
