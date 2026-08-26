"use client";

import { useState } from "react";
import { Zap, Flame, Target, ShieldCheck, Award, Lock, CheckCircle2, Trophy } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

function BadgeIcon({ icon, className = "w-6 h-6" }) {
  switch (icon) {
    case "Zap":
      return <Zap className={className} />;
    case "Flame":
      return <Flame className={className} />;
    case "Target":
      return <Target className={className} />;
    case "ShieldCheck":
      return <ShieldCheck className={className} />;
    case "Award":
    default:
      return <Award className={className} />;
  }
}

const TIER_STYLES = {
  bronze: {
    bg: "bg-amber-50/60 border-amber-200/80",
    text: "text-amber-900",
    badge: "bg-amber-100 text-amber-800 border-amber-300",
    iconBg: "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-amber-500/30",
    glow: "shadow-amber-500/10",
  },
  silver: {
    bg: "bg-slate-50 border-slate-200",
    text: "text-slate-900",
    badge: "bg-slate-200 text-slate-800 border-slate-300",
    iconBg: "bg-gradient-to-br from-slate-400 to-slate-600 text-white shadow-slate-500/30",
    glow: "shadow-slate-500/10",
  },
  gold: {
    bg: "bg-yellow-50/70 border-yellow-300/80",
    text: "text-yellow-950",
    badge: "bg-yellow-100 text-yellow-800 border-yellow-400",
    iconBg: "bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 text-white shadow-yellow-500/40",
    glow: "shadow-yellow-500/20",
  },
  platinum: {
    bg: "bg-purple-50/70 border-purple-200/90",
    text: "text-purple-950",
    badge: "bg-purple-100 text-purple-800 border-purple-300",
    iconBg: "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-purple-500/40",
    glow: "shadow-purple-500/20",
  },
};

export default function AchievementsGallery({ achievements = [], isLoading = false }) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState("all"); // all, unlocked, locked

  const unlockedCount = achievements.filter((a) => a.is_unlocked).length;
  const totalCount = achievements.length;

  const filteredAchievements = achievements.filter((a) => {
    if (filter === "unlocked") return a.is_unlocked;
    if (filter === "locked") return !a.is_unlocked;
    return true;
  });

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
      
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              {t("rewards.achievements_title") || "Koleksi Lencana & Prestasi"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {t("rewards.achievements_desc") || "Buka lencana khusus dengan mencapai milestone finansial penting."}
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t("common.all") || "Semua"} ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("unlocked")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === "unlocked" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t("rewards.unlocked") || "Terbuka"} ({unlockedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("locked")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === "locked" ? "bg-white text-slate-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t("rewards.locked") || "Terkunci"} ({totalCount - unlockedCount})
          </button>
        </div>
      </div>

      {/* Badges Grid */}
      {isLoading ? (
        <div className="py-12 flex justify-center">
          <span className="w-8 h-8 border-3 border-[#00685F]/20 border-t-[#00685F] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((badge) => {
            const tierStyle = TIER_STYLES[badge.tier] || TIER_STYLES.bronze;
            const percent = badge.required_count > 0 
              ? Math.min(100, Math.round((badge.progress / badge.required_count) * 100)) 
              : 0;

            return (
              <div
                key={badge.id}
                className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  badge.is_unlocked
                    ? `${tierStyle.bg} ${tierStyle.glow} shadow-md hover:scale-[1.02]`
                    : "bg-slate-50/50 border-slate-100 opacity-60 hover:opacity-80"
                }`}
              >
                <div>
                  {/* Top Row: Icon + XP + Tier badge */}
                  <div className="flex items-start justify-between gap-2 mb-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform ${
                        badge.is_unlocked ? `${tierStyle.iconBg}` : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      {badge.is_unlocked ? (
                        <BadgeIcon icon={badge.icon} className="w-6 h-6" />
                      ) : (
                        <Lock className="w-5 h-5 text-slate-400" />
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border bg-white/80 text-slate-700">
                        {badge.tier}
                      </span>
                      <span className="text-[11px] font-extrabold text-[#00685F] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        +{badge.xp_reward} XP
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h4 className="text-sm font-black text-slate-900 leading-snug">
                    {badge.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                {/* Bottom Status / Progress Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100/80">
                  {badge.is_unlocked ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>{t("rewards.unlocked_badge") || "Telah Dibuka"}</span>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold text-slate-400">
                        <span>{t("rewards.progress") || "Progres"}</span>
                        <span>{badge.progress} / {badge.required_count} ({percent}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#00685F] rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
