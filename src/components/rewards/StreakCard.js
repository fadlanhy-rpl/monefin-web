"use client";

import { Flame, Shield, CheckCircle2, Award, Trophy, Crown } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const MILESTONES = [
  {
    days: 3,
    labelId: "3 Hari",
    labelEn: "3 Days",
    name: "Spark",
    icon: Award,
    color: "from-amber-600 to-amber-800 text-amber-700 bg-amber-50 border-amber-200",
    badgeBg: "bg-gradient-to-br from-amber-500 to-amber-700 text-white",
  },
  {
    days: 7,
    labelId: "7 Hari",
    labelEn: "7 Days",
    name: "Warrior",
    icon: Award,
    color: "from-slate-400 to-slate-600 text-slate-700 bg-slate-50 border-slate-200",
    badgeBg: "bg-gradient-to-br from-slate-400 to-slate-600 text-white",
  },
  {
    days: 30,
    labelId: "30 Hari",
    labelEn: "30 Days",
    name: "Master",
    icon: Trophy,
    color: "from-yellow-400 to-amber-600 text-amber-800 bg-yellow-50 border-yellow-300",
    badgeBg: "bg-gradient-to-br from-yellow-400 to-amber-500 text-white",
  },
  {
    days: 100,
    labelId: "100 Hari",
    labelEn: "100 Days",
    name: "Legend",
    icon: Crown,
    color: "from-purple-500 to-indigo-600 text-purple-800 bg-purple-50 border-purple-200",
    badgeBg: "bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 text-white",
  },
];

export default function StreakCard({ streak = 0, longestStreak = 0, freezes = 0 }) {
  const { t, language } = useLanguage();

  const daysLabel = language === "en" 
    ? (streak === 1 ? "Day" : "Days") 
    : "Hari";

  return (
    <div className="bg-white p-5 sm:p-7 rounded-3xl sm:rounded-[2.25rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 space-y-5 sm:space-y-6 flex flex-col justify-between overflow-hidden">
      
      <div className="space-y-4 sm:space-y-5">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 p-0.5 shadow-md shadow-orange-500/20 shrink-0">
              <div className="w-full h-full bg-orange-50 rounded-[0.9rem] flex items-center justify-center text-orange-500">
                <Flame className="w-6 h-6 sm:w-7 sm:h-7 fill-orange-500 animate-pulse" />
              </div>
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
                {t("rewards.habit_streak", "Daily Habit Streak")}
              </h3>
              <p className="text-xs text-slate-500 font-medium line-clamp-1">
                {t("rewards.streak_desc", "Catat transaksi setiap hari untuk menjaga api disiplinmu!")}
              </p>
            </div>
          </div>

          {/* Current streak number */}
          <div className="text-right shrink-0">
            <span className="text-2xl sm:text-4xl font-black text-orange-500 leading-none">
              {streak}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 block mt-0.5">
              {daysLabel}
            </span>
          </div>
        </div>

        {/* Milestone Badge Grid */}
        <div className="space-y-2">
          <p className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Milestone Streak
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {MILESTONES.map((m) => {
              const reached = streak >= m.days;
              const IconComponent = m.icon;
              const label = language === "en" ? m.labelEn : m.labelId;

              return (
                <div
                  key={m.days}
                  className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between min-w-0 ${
                    reached
                      ? `${m.color} shadow-xs font-bold scale-[1.01]`
                      : "bg-slate-50 border-slate-100 text-slate-400 opacity-60"
                  }`}
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center mb-1 shadow-2xs shrink-0 ${
                      reached ? m.badgeBg : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>

                  <p className="text-[10px] font-black leading-tight truncate w-full">{label}</p>
                  
                  <div className="mt-1 h-3.5 flex items-center justify-center">
                    {reached ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <span className="text-[9px] text-slate-400 font-bold">
                        {language === "en" ? "Locked" : "Kunci"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Saver Shield Status Box */}
      <div className="bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-emerald-50/90 border border-emerald-200/80 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-700/20">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
              {t("rewards.saver_shield_title", "Saver Shield (Perlindungan Streak)")}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              {freezes > 0
                ? (language === "en"
                    ? `Automatically protects your streak if you miss a day (${freezes} active).`
                    : `Melindungi streak otomatis jika lupa mencatat 1 hari (${freezes} aktif).`)
                : (language === "en"
                    ? "No active shields. Earn bonus shields every 5 levels."
                    : "Tidak ada shield aktif. Dapatkan bonus shield setiap kelipatan Level 5.")}
            </p>
          </div>
        </div>

        <span className="font-black text-emerald-900 bg-white border border-emerald-200 px-3 py-1.5 rounded-xl text-xs shrink-0 self-end sm:self-center shadow-2xs">
          {freezes} Shield
        </span>
      </div>

    </div>
  );
}
