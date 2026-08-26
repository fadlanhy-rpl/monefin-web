"use client";

import { Flame, Shield, CheckCircle2, HelpCircle } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function StreakCard({ streak = 0, longestStreak = 0, freezes = 0 }) {
  const { t } = useLanguage();

  const milestones = [
    { days: 3, label: "3 Hari", emoji: "🥉" },
    { days: 7, label: "7 Hari", emoji: "🥈" },
    { days: 30, label: "30 Hari", emoji: "🥇" },
    { days: 100, label: "100 Hari", emoji: "👑" },
  ];

  return (
    <div className="bg-white p-6 sm:p-7 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 shadow-sm animate-pulse">
            <Flame className="w-7 h-7 fill-orange-500 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">
              {t("rewards.habit_streak") || "Daily Habit Streak"}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              {t("rewards.streak_desc") || "Catat transaksi setiap hari untuk menjaga api disiplinmu!"}
            </p>
          </div>
        </div>

        {/* Current streak number */}
        <div className="text-right">
          <span className="text-3xl sm:text-4xl font-black text-orange-500 leading-none">
            {streak}
          </span>
          <span className="text-xs font-bold text-slate-400 block mt-0.5">
            {t("rewards.days") || "Hari"}
          </span>
        </div>
      </div>

      {/* Streak Milestones Progress */}
      <div className="grid grid-cols-4 gap-2 pt-1">
        {milestones.map((m) => {
          const reached = streak >= m.days;
          return (
            <div
              key={m.days}
              className={`p-3 rounded-2xl border text-center transition-all ${
                reached
                  ? "bg-orange-50/80 border-orange-200 text-orange-800 shadow-sm"
                  : "bg-slate-50/60 border-slate-100 text-slate-400 opacity-60"
              }`}
            >
              <div className="text-lg mb-0.5">{m.emoji}</div>
              <p className="text-[10px] font-black">{m.label}</p>
              {reached && (
                <div className="flex justify-center mt-1 text-orange-600">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Saver Shield Box */}
      <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-[#00685F] flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="font-extrabold text-slate-800">
              {t("rewards.saver_shield_title") || "Saver Shield (Perlindungan Streak)"}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {freezes > 0
                ? `Otomatis melindungi streak Anda jika lupa mencatat 1 hari (${freezes} tersisa).`
                : "Tidak ada perlindungan tersisa. Dapatkan bonus shield di Level 5, 10, dst."}
            </p>
          </div>
        </div>
        <span className="font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-xl text-xs shrink-0">
          {freezes} Shield
        </span>
      </div>

    </div>
  );
}
