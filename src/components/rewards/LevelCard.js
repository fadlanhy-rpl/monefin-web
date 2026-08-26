"use client";

import { Zap, Trophy, Sparkles, Award } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function LevelCard({ data }) {
  const { t, language } = useLanguage();

  if (!data) return null;

  const level = data.level || 1;
  const totalXp = data.total_xp || 0;
  const xpInLevel = data.xp_in_current_level || 0;
  const xpNeeded = data.xp_needed_for_next || 150;
  const percent = data.progress_percent || 0;
  const rankTitle = language === "en" ? data.rank_title : (data.rank_title_id || data.rank_title);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#004d46] to-[#003833] text-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl border border-emerald-500/20">
      
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#00A896]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-inner">
              <Zap className="w-6 h-6 fill-emerald-300" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400">
                {t("rewards.rank_level") || "LEVEL KEMAHIRAN"}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                Level {level}
                <span className="text-sm sm:text-base font-bold text-emerald-200/90 font-mono">
                  • {rankTitle}
                </span>
              </h2>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 flex items-center gap-2 text-xs font-bold text-amber-300 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{totalXp.toLocaleString()} Total XP</span>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-300">
              {t("rewards.xp_progress") || "Progres Level Berikutnya"}
            </span>
            <span className="text-emerald-300 font-mono">
              {xpInLevel} / {xpNeeded} XP ({percent}%)
            </span>
          </div>

          {/* Bar track */}
          <div className="w-full h-3.5 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-[#00A896] rounded-full transition-all duration-700 ease-out shadow-sm"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Bottom Level Perks / Stats */}
        <div className="pt-2 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-[10px] uppercase font-bold text-slate-400">{t("rewards.streak_freezes") || "Saver Shield"}</p>
            <p className="text-sm sm:text-base font-black text-amber-300 mt-0.5">🛡️ {data.streak_freezes || 0} Tersedia</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-[10px] uppercase font-bold text-slate-400">{t("rewards.badges_unlocked") || "Lencana Terbuka"}</p>
            <p className="text-sm sm:text-base font-black text-emerald-300 mt-0.5">🏆 {data.unlocked_badges || 0} / {data.total_badges || 0}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5 col-span-2 sm:col-span-1">
            <p className="text-[10px] uppercase font-bold text-slate-400">{t("rewards.longest_streak") || "Streak Terpanjang"}</p>
            <p className="text-sm sm:text-base font-black text-orange-400 mt-0.5">🔥 {data.longest_streak || 0} Hari</p>
          </div>
        </div>

      </div>
    </div>
  );
}
