"use client";

import { useState } from "react";
import { Zap, Trophy, Sparkles, Shield, Flame, Check, Crown, Info, X } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const RANK_TIERS = [
  { minLevel: 1, maxLevel: 4, titleEn: "Financial Novice", titleId: "Pemula Finansial", color: "from-emerald-400 to-teal-500", text: "text-emerald-300" },
  { minLevel: 5, maxLevel: 9, titleEn: "Budget Explorer", titleId: "Penjelajah Anggaran", color: "from-teal-400 to-cyan-500", text: "text-teal-300" },
  { minLevel: 10, maxLevel: 19, titleEn: "Wealth Builder", titleId: "Pembangun Aset", color: "from-blue-400 to-indigo-500", text: "text-blue-300" },
  { minLevel: 20, maxLevel: 34, titleEn: "Money Strategist", titleId: "Ahli Strategi", color: "from-purple-400 to-pink-500", text: "text-purple-300" },
  { minLevel: 35, maxLevel: 49, titleEn: "Wealth Architect", titleId: "Arsitek Kekayaan", color: "from-amber-400 to-orange-500", text: "text-amber-300" },
  { minLevel: 50, maxLevel: 100, titleEn: "Financial Grandmaster", titleId: "Grandmaster Finansial", color: "from-yellow-300 via-amber-400 to-red-500", text: "text-yellow-300" },
];

export default function LevelCard({ data }) {
  const { t, language } = useLanguage();
  const [showRanksModal, setShowRanksModal] = useState(false);

  if (!data) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-[#003831] via-[#005a52] to-[#004740] text-white p-5 sm:p-7 md:p-8 rounded-3xl sm:rounded-[2.25rem] shadow-xl border border-emerald-400/20 animate-pulse min-h-[280px] sm:min-h-[300px] flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/15 shrink-0" />
            <div className="space-y-2">
              <div className="w-24 sm:w-28 h-4 bg-white/15 rounded-md" />
              <div className="w-36 sm:w-44 h-6 sm:h-7 bg-white/20 rounded-md" />
            </div>
          </div>
          <div className="w-28 h-8 bg-white/15 rounded-2xl self-start sm:self-auto" />
        </div>
        <div className="space-y-2 bg-black/20 p-4 sm:p-5 rounded-2xl my-3 sm:my-4">
          <div className="flex justify-between">
            <div className="w-32 sm:w-36 h-4 bg-white/15 rounded-md" />
            <div className="w-20 sm:w-24 h-4 bg-white/15 rounded-md" />
          </div>
          <div className="w-full h-3.5 bg-white/15 rounded-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          <div className="h-14 sm:h-16 bg-white/10 rounded-2xl" />
          <div className="h-14 sm:h-16 bg-white/10 rounded-2xl" />
          <div className="h-14 sm:h-16 bg-white/10 rounded-2xl" />
        </div>
      </div>
    );
  }

  const level = data.level || 1;
  const totalXp = data.total_xp || 0;
  const xpInLevel = data.xp_in_current_level || 0;
  const xpNeeded = data.xp_needed_for_next || 150;
  const percent = data.progress_percent || 0;
  const rankTitle = language === "en" ? data.rank_title : (data.rank_title_id || data.rank_title);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#003831] via-[#005a52] to-[#004740] text-white p-5 sm:p-7 md:p-8 rounded-3xl sm:rounded-[2.25rem] shadow-xl border border-emerald-400/20 group flex flex-col justify-between">
      
      {/* Ambient glowing orbs */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-56 h-56 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-5 sm:space-y-6">
        
        {/* TOP ROW: Level Avatar + Rank Title + Total XP Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            
            {/* Interactive Level Badge */}
            <div className="relative group/avatar cursor-pointer shrink-0" onClick={() => setShowRanksModal(true)}>
              <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-400 via-[#00A896] to-teal-700 p-0.5 shadow-lg shadow-emerald-950/40">
                <div className="w-full h-full bg-[#003630] rounded-[0.9rem] flex flex-col items-center justify-center text-center">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 fill-emerald-400 group-hover/avatar:scale-110 transition-transform" />
                  <span className="text-[9px] sm:text-[10px] font-black text-emerald-200 tracking-tighter uppercase mt-0.5">
                    LV.{level}
                  </span>
                </div>
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full ring-2 ring-[#003630] animate-ping opacity-75" />
            </div>

            {/* Rank and Title */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-emerald-300/90 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-400/20 inline-block">
                  {t("rewards.rank_level", "LEVEL KEMAHIRAN")}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight truncate">
                  {rankTitle}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowRanksModal(true)}
                  className="p-1 text-emerald-300/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all cursor-pointer shrink-0"
                  title="Lihat Jenjang Level"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Total XP Badge */}
          <div className="bg-white/10 backdrop-blur-md px-3.5 sm:px-4 py-2 rounded-2xl border border-white/15 flex items-center gap-2 text-xs font-bold text-amber-300 shadow-sm self-start sm:self-auto shrink-0">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{totalXp.toLocaleString()} Total XP</span>
          </div>
        </div>

        {/* XP PROGRESS BAR WITH MILESTONE TICKS */}
        <div className="space-y-2 bg-black/20 backdrop-blur-sm p-3.5 sm:p-5 rounded-2xl border border-white/10">
          <div className="flex flex-wrap justify-between items-center text-xs font-bold gap-1.5">
            <span className="text-emerald-200/90 flex items-center gap-1.5 text-[11px] sm:text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{t("rewards.xp_progress", "Progres Level Berikutnya")}</span>
            </span>
            <span className="text-emerald-300 font-mono font-bold text-[11px] sm:text-xs">
              {xpInLevel} / {xpNeeded} XP <span className="text-white">({percent}%)</span>
            </span>
          </div>

          {/* Bar track */}
          <div className="relative w-full h-3 sm:h-3.5 bg-slate-900/80 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-[#00A896] rounded-full transition-all duration-700 ease-out shadow-sm relative"
              style={{ width: `${percent}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-300/90 font-medium pt-0.5 gap-1">
            <span className="shrink-0">Lv.{level}</span>
            <span className="truncate text-center px-1">
              {Math.max(0, xpNeeded - xpInLevel)} XP {language === "en" ? "to" : "ke"} Lv.{level + 1}
            </span>
            <span className="shrink-0">Lv.{level + 1}</span>
          </div>
        </div>

        {/* BOTTOM METRIC CAPSULES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-0.5">
          {/* 1. Saver Shield */}
          <div className="bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-white/10 flex items-center gap-3 transition-all">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-slate-300 truncate">
                {t("rewards.streak_freezes", "Saver Shield")}
              </p>
              <p className="text-xs sm:text-sm font-black text-teal-300 mt-0.5 truncate">
                {data.streak_freezes || 0} {language === "en" ? "Available" : "Tersedia"}
              </p>
            </div>
          </div>

          {/* 2. Badges Unlocked */}
          <div className="bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-white/10 flex items-center gap-3 transition-all">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-slate-300 truncate">
                {t("rewards.badges_unlocked", "Lencana Terbuka")}
              </p>
              <p className="text-xs sm:text-sm font-black text-amber-300 mt-0.5 truncate">
                {data.unlocked_badges || 0} / {data.total_badges || 0}
              </p>
            </div>
          </div>

          {/* 3. Best Streak */}
          <div className="bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-white/10 flex items-center gap-3 transition-all">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-400/30 flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 fill-orange-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-slate-300 truncate">
                {t("rewards.longest_streak", "Streak Terbaik")}
              </p>
              <p className="text-xs sm:text-sm font-black text-orange-400 mt-0.5 truncate">
                {data.longest_streak || 0} {t("rewards.days", "Hari")}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL: LEVEL & RANKS ROADMAP */}
      {showRanksModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white text-slate-900 w-full max-w-lg rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4 sm:space-y-5 border border-slate-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#00685F] flex items-center justify-center font-bold shrink-0">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">Jenjang Tingkat Finansial</h3>
                  <p className="text-xs text-slate-500">Tingkatkan XP Anda untuk meraih status tertinggi</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRanksModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold cursor-pointer shrink-0 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {RANK_TIERS.map((tier, idx) => {
                const isCurrent = level >= tier.minLevel && level <= tier.maxLevel;
                const isPassed = level > tier.maxLevel;
                const title = language === "en" ? tier.titleEn : tier.titleId;

                return (
                  <div
                    key={idx}
                    className={`p-3 sm:p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                      isCurrent
                        ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/20 shadow-sm"
                        : isPassed
                        ? "bg-slate-50 border-slate-200 opacity-75"
                        : "bg-white border-slate-100 opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs text-white bg-gradient-to-br ${tier.color} shadow-sm shrink-0`}
                      >
                        Lv.{tier.minLevel}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs sm:text-sm font-black text-slate-800 truncate">{title}</h4>
                          {isCurrent && (
                            <span className="text-[9px] bg-[#00685F] text-white font-extrabold px-2 py-0.2 rounded-full shrink-0">
                              Anda di sini
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">Level {tier.minLevel} - {tier.maxLevel === 100 ? "50+" : tier.maxLevel}</p>
                      </div>
                    </div>

                    {isPassed ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : isCurrent ? (
                      <span className="text-xs font-bold text-[#00685F] font-mono shrink-0">{percent}%</span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-bold shrink-0">Terkunci</span>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setShowRanksModal(false)}
              className="w-full py-3 bg-[#00685F] hover:bg-[#00554E] text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
