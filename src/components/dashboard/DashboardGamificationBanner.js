"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, Zap, Trophy, ArrowRight, Target, Shield } from "lucide-react";
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
      .catch(() => { });
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
    <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-white border border-emerald-100/90 hover:border-emerald-200/90 rounded-[1.5rem] sm:rounded-[1.75rem] p-4 sm:p-5 shadow-[0_4px_20px_-4px_rgba(0,104,95,0.06)] hover:shadow-[0_8px_30px_-4px_rgba(0,104,95,0.12)] transition-all duration-300 group">

      {/* Ambient background decoration */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-16 w-40 h-40 bg-teal-200/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">

        {/* SISI KIRI: Level + Rank + XP Bar + Streak & Badge Pills */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-5 min-w-0 flex-1">

          {/* Level Icon & XP Progress */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#00685F] to-[#00A896] flex items-center justify-center text-white shadow-md shadow-emerald-700/20 shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
            </div>

            <div className="space-y-1 sm:space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="bg-[#00685F] text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full shadow-xs shrink-0">
                  Level {level}
                </span>
                <span className="text-xs sm:text-sm font-black text-slate-800 tracking-tight truncate max-w-[150px] sm:max-w-[200px]">
                  {rankTitle}
                </span>
              </div>

              {/* XP progress bar */}
              <div className="flex items-center gap-2">
                <div className="w-24 sm:w-32 h-2 bg-slate-200/80 rounded-full overflow-hidden shrink-0">
                  <div
                    className="h-full w-full bg-gradient-to-r from-[#00685F] to-[#00A896] rounded-full transition-transform duration-500 origin-left"
                    style={{ transform: `scaleX(${Math.min(Math.max(percent || 0, 0), 100) / 100})` }}
                  />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-600 font-mono whitespace-nowrap">
                  {xpInLevel}/{xpNeeded} XP ({percent}%)
                </span>
              </div>

            </div>
          </div>

          {/* Interactive Streak & Badges Stats */}
          <div className="flex flex-wrap items-center gap-2 pl-0 sm:pl-3 border-l-0 sm:border-l border-emerald-100/80">
            {/* Streak Flame Pill */}
            <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200/80 text-orange-900 px-2.5 sm:px-3 py-1.5 rounded-xl font-extrabold text-xs shadow-xs hover:scale-105 transition-transform">
              <Flame className="w-3.5 h-3.5 fill-orange-600 text-orange-600 animate-pulse" />
              <span className="whitespace-nowrap">{streak} {t("rewards.days", "Hari")} Streak</span>
            </div>


            {/* Badges Count Pill */}
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 text-amber-800 px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs hover:scale-105 transition-transform">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span className="whitespace-nowrap">{data.unlocked_badges || 0} {t("rewards.badges_unlocked", "Lencana")}</span>
            </div>

            {/* Saver Shield Pill */}
            <div className="hidden xl:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 text-[#00685F] px-2.5 py-1.5 rounded-xl font-bold text-xs shadow-xs">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span className="whitespace-nowrap">{data.streak_freezes || 0} Shield</span>
            </div>
          </div>

        </div>

        {/* SISI KANAN: Misi Aktif & Tombol CTA */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-emerald-100/70">

          {/* Active Mission Mini Card */}
          {activeQuest && (() => {
            const localizedQuest = getLocalizedQuest(activeQuest, language);
            return (
              <div className="hidden min-[1420px]:flex items-center gap-2.5 bg-white/80 border border-emerald-100/90 px-3 py-1.5 rounded-xl shadow-xs max-w-[220px]">
                <div className="w-7 h-7 rounded-lg bg-emerald-100/80 text-[#00685F] flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4 text-[#00685F]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-slate-600 tracking-wider">Misi Aktif</span>
                    <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 rounded">

                      +{activeQuest.xp_reward} XP
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-700 truncate mt-0.5" title={localizedQuest.title}>
                    {localizedQuest.title}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* CTA Link Button */}
          <Link
            href="/rewards"
            className="w-full sm:w-auto px-4 py-2.5 bg-[#00685F] hover:bg-[#00554E] text-white rounded-xl font-extrabold text-xs shadow-sm hover:shadow-md hover:shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 group/btn cursor-pointer shrink-0 whitespace-nowrap"
          >
            <span>{t("sidebar.rewards", "Pencapaian & Hadiah")}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}
