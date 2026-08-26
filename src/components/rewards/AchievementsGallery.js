"use client";

import { useState } from "react";
import { Zap, Flame, Target, ShieldCheck, Award, Lock, CheckCircle2, Trophy, Sparkles } from "lucide-react";
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
    name: "Bronze",
    border: "border-amber-300/80 hover:border-amber-400",
    bg: "bg-gradient-to-b from-amber-50/80 via-white to-amber-50/40",
    pill: "bg-amber-100/90 text-amber-800 border-amber-300",
    iconBg: "bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-amber-600/30",
    glow: "shadow-amber-500/10",
  },
  silver: {
    name: "Silver",
    border: "border-slate-300/80 hover:border-slate-400",
    bg: "bg-gradient-to-b from-slate-50/90 via-white to-slate-100/40",
    pill: "bg-slate-200/90 text-slate-800 border-slate-300",
    iconBg: "bg-gradient-to-br from-slate-400 to-slate-600 text-white shadow-slate-600/30",
    glow: "shadow-slate-500/10",
  },
  gold: {
    name: "Gold",
    border: "border-yellow-300 hover:border-yellow-400",
    bg: "bg-gradient-to-b from-yellow-50/90 via-amber-50/40 to-white",
    pill: "bg-yellow-100 text-yellow-800 border-yellow-400",
    iconBg: "bg-gradient-to-br from-yellow-400 via-amber-500 to-amber-600 text-white shadow-yellow-500/30",
    glow: "shadow-yellow-500/15",
  },
  platinum: {
    name: "Platinum",
    border: "border-purple-300 hover:border-purple-400",
    bg: "bg-gradient-to-b from-purple-50/90 via-pink-50/30 to-white",
    pill: "bg-purple-100 text-purple-800 border-purple-300",
    iconBg: "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-purple-500/30",
    glow: "shadow-purple-500/15",
  },
};

export default function AchievementsGallery({ achievements = [], isLoading = false }) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState("all"); // all, unlocked, locked
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedBadge, setSelectedBadge] = useState(null);

  const unlockedCount = achievements.filter((a) => a.is_unlocked).length;
  const totalCount = achievements.length;

  const categories = [
    { key: "all", label: "Semua Kategori" },
    { key: "transaction", label: "Transaksi" },
    { key: "streak", label: "Streak" },
    { key: "saving", label: "Tabungan" },
    { key: "security", label: "Keamanan" },
    { key: "budget", label: "Anggaran" },
  ];

  const filteredAchievements = achievements.filter((a) => {
    if (filter === "unlocked" && !a.is_unlocked) return false;
    if (filter === "locked" && a.is_unlocked) return false;
    if (categoryFilter !== "all" && a.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="bg-white p-5 sm:p-7 md:p-8 rounded-3xl sm:rounded-[2.25rem] border border-slate-100 shadow-sm space-y-5 sm:space-y-6 overflow-hidden">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 sm:pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {t("rewards.achievements_title", "Koleksi Lencana & Prestasi")}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {t("rewards.achievements_desc", "Buka lencana khusus dengan mencapai milestone finansial penting.")}
            </p>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl self-start md:self-auto overflow-x-auto max-w-full scrollbar-none">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              filter === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t("common.all", "Semua")} ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("unlocked")}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              filter === "unlocked" ? "bg-white text-emerald-700 shadow-2xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t("rewards.unlocked", "Terbuka")} ({unlockedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("locked")}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              filter === "locked" ? "bg-white text-slate-700 shadow-2xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t("rewards.locked", "Terkunci")} ({totalCount - unlockedCount})
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none max-w-full">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setCategoryFilter(cat.key)}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
              categoryFilter === cat.key
                ? "bg-[#00685F] text-white border-[#00685F] shadow-2xs"
                : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200/70"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      {isLoading ? (
        <div className="py-12 flex justify-center">
          <span className="w-8 h-8 border-3 border-[#00685F]/20 border-t-[#00685F] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredAchievements.map((badge) => {
            const tierStyle = TIER_STYLES[badge.tier] || TIER_STYLES.bronze;
            const percent = badge.required_count > 0 
              ? Math.min(100, Math.round((badge.progress / badge.required_count) * 100)) 
              : 0;

            return (
              <div
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between cursor-pointer group ${
                  badge.is_unlocked
                    ? `${tierStyle.bg} ${tierStyle.border} ${tierStyle.glow} shadow-2xs hover:shadow-md hover:scale-[1.01]`
                    : "bg-slate-50/70 border-slate-100 opacity-60 hover:opacity-90 hover:border-slate-200"
                }`}
              >
                <div>
                  {/* Top Row: Icon + XP + Tier badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div
                      className={`w-12 h-12 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 shrink-0 ${
                        badge.is_unlocked ? tierStyle.iconBg : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      {badge.is_unlocked ? (
                        <BadgeIcon icon={badge.icon} className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        <Lock className="w-5 h-5 text-slate-400" />
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-2xs ${tierStyle.pill}`}>
                        {tierStyle.name}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-extrabold text-[#00685F] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        +{badge.xp_reward} XP
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                    {badge.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1 leading-relaxed line-clamp-2">
                    {badge.description}
                  </p>
                </div>

                {/* Bottom Status / Progress Bar */}
                <div className="mt-3.5 pt-3 border-t border-slate-100">
                  {badge.is_unlocked ? (
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
                      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{t("rewards.unlocked_badge", "Telah Dibuka")}</span>
                      </div>
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] sm:text-[11px] font-bold text-slate-400">
                        <span>{t("rewards.progress", "Progres")}</span>
                        <span>{badge.progress} / {badge.required_count} ({percent}%)</span>
                      </div>
                      <div className="w-full h-1.5 sm:h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#00685F] to-[#00A896] rounded-full transition-all duration-500"
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

      {/* BADGE DETAIL POPUP MODAL */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white text-slate-900 w-full max-w-sm rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 border border-slate-100 text-center">
            
            {/* Big Icon */}
            <div className="flex justify-center pt-2">
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-md ${
                  selectedBadge.is_unlocked
                    ? (TIER_STYLES[selectedBadge.tier]?.iconBg || "bg-emerald-600 text-white")
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                {selectedBadge.is_unlocked ? (
                  <BadgeIcon icon={selectedBadge.icon} className="w-7 h-7 sm:w-8 sm:h-8" />
                ) : (
                  <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-slate-400" />
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  Tier {selectedBadge.tier}
                </span>
                <span className="text-xs font-black text-[#00685F] bg-emerald-50 px-2 py-0.5 rounded-md">
                  +{selectedBadge.xp_reward} XP
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">{selectedBadge.title}</h3>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                {selectedBadge.description}
              </p>
            </div>

            {/* Progress Box */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 text-xs">
              {selectedBadge.is_unlocked ? (
                <div className="flex items-center justify-center gap-2 text-emerald-700 font-extrabold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Prestasi Berhasil Dicapai! 🎉</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-600 text-[11px]">
                    <span>Target Penyelesaian</span>
                    <span>{selectedBadge.progress} / {selectedBadge.required_count}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00685F] to-[#00A896] rounded-full"
                      style={{
                        width: `${Math.min(100, Math.round((selectedBadge.progress / selectedBadge.required_count) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-all cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
