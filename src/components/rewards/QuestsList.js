"use client";

import { useState } from "react";
import { Target, Sparkles, Clock, Check, Calendar, Zap } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { claimQuestReward } from "../../services/gamification.service";
import { getLocalizedQuest } from "../../lib/gamificationDictionary";
import toast from "react-hot-toast";

export default function QuestsList({ quests = [], onClaimSuccess }) {
  const { t, language } = useLanguage();
  const [claimingId, setClaimingId] = useState(null);

  const questList = Array.isArray(quests) ? quests : (quests ? Object.values(quests) : []);

  const handleClaim = async (questId) => {
    setClaimingId(questId);
    try {
      const res = await claimQuestReward(questId);
      toast.success(res.message || (language === "en" ? "XP reward claimed successfully!" : "Hadiah XP berhasil diklaim!"));
      if (onClaimSuccess) {
        onClaimSuccess(res);
      }
    } catch (err) {
      toast.error(err?.data?.message || (language === "en" ? "Failed to claim quest reward." : "Gagal mengklaim hadiah misi."));
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className="bg-white p-5 sm:p-7 md:p-8 rounded-3xl sm:rounded-[2.25rem] border border-slate-100 shadow-sm space-y-5 sm:space-y-6 overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#00685F] flex items-center justify-center shadow-2xs shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {t("rewards.quests_title", "Misi & Tantangan Finansial")}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {t("rewards.quests_desc", "Selesaikan misi harian & mingguan untuk meraih bonus XP berlimpah.")}
            </p>
          </div>
        </div>
      </div>

      {/* Quests List */}
      <div className="space-y-3 sm:space-y-3.5">
        {questList.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-8">
            {t("rewards.no_quests", "Tidak ada misi aktif saat ini.")}
          </p>
        ) : (
          questList.map((quest) => {
            const percent = quest.target_count > 0 
              ? Math.min(100, Math.round((quest.current_count / quest.target_count) * 100)) 
              : 0;

            const canClaim = quest.is_completed && !quest.is_claimed;
            const localized = getLocalizedQuest(quest, language);

            return (
              <div
                key={quest.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 ${
                  quest.is_claimed
                    ? "bg-slate-50/60 border-slate-100 opacity-60"
                    : canClaim
                    ? "bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-white border-emerald-300 ring-2 ring-emerald-400/20 shadow-2xs"
                    : "bg-white border-slate-100 hover:border-slate-200"
                }`}
              >
                {/* Left: Quest Info */}
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1">
                      {quest.type === "daily" ? (
                        <>
                          <Clock className="w-3 h-3 text-orange-500 shrink-0" />
                          <span>{t("rewards.daily", "Harian")}</span>
                        </>
                      ) : (
                        <>
                          <Calendar className="w-3 h-3 text-teal-600 shrink-0" />
                          <span>{t("rewards.weekly", "Mingguan")}</span>
                        </>
                      )}
                    </span>

                    <span className="text-[11px] sm:text-xs font-black text-[#00685F] bg-emerald-100/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-[#00685F] shrink-0" />
                      +{quest.xp_reward} XP
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                    {localized.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                    {localized.description}
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-1 pt-1 max-w-md">
                    <div className="flex justify-between text-[10px] sm:text-[11px] font-bold text-slate-400">
                      <span>{t("rewards.progress", "Progres")}</span>
                      <span className="font-mono text-slate-600">
                        {quest.current_count} / {quest.target_count} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 sm:h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          quest.is_completed ? "bg-emerald-500" : "bg-[#00685F]"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Action Button */}
                <div className="shrink-0 w-full sm:w-auto">
                  {quest.is_claimed ? (
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>{t("rewards.claimed", "Telah Diklaim")}</span>
                    </div>
                  ) : canClaim ? (
                    <button
                      type="button"
                      onClick={() => handleClaim(quest.id)}
                      disabled={claimingId === quest.id}
                      className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-[#00A896] hover:from-emerald-700 hover:to-[#008f80] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-700/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {claimingId === quest.id ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-amber-300" />
                      )}
                      <span>{t("rewards.claim_reward", "Klaim Hadiah")}</span>
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl block text-center">
                      {t("rewards.in_progress", "Sedang Berjalan")}
                    </span>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
