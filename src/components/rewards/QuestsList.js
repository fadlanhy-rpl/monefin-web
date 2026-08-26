"use client";

import { useState } from "react";
import { Target, CheckCircle2, Gift, Sparkles, Clock, Check } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { claimQuestReward } from "../../services/gamification.service";
import toast from "react-hot-toast";

export default function QuestsList({ quests = [], onClaimSuccess }) {
  const { t } = useLanguage();
  const [claimingId, setClaimingId] = useState(null);

  const handleClaim = async (questId) => {
    setClaimingId(questId);
    try {
      const res = await claimQuestReward(questId);
      toast.success(res.message || "Hadiah XP berhasil diklaim! 🎉");
      if (onClaimSuccess) {
        onClaimSuccess(res);
      }
    } catch (err) {
      toast.error(err?.data?.message || "Gagal mengklaim hadiah misi.");
    } finally {
      setClaimingId(null);
    }
  };

  const dailyQuests = quests.filter((q) => q.type === "daily");
  const weeklyQuests = quests.filter((q) => q.type === "weekly");

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00685F] flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              {t("rewards.quests_title", "Misi & Tantangan Finansial")}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              {t("rewards.quests_desc", "Selesaikan misi harian & mingguan untuk meraih bonus XP berlimpah.")}
            </p>
          </div>
        </div>
      </div>

      {/* Quests List */}
      <div className="space-y-4">
        {quests.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            {t("rewards.no_quests", "Tidak ada misi aktif saat ini.")}
          </p>
        ) : (
          quests.map((quest) => {
            const percent = quest.target_count > 0 
              ? Math.min(100, Math.round((quest.current_count / quest.target_count) * 100)) 
              : 0;

            const canClaim = quest.is_completed && !quest.is_claimed;

            return (
              <div
                key={quest.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  quest.is_claimed
                    ? "bg-slate-50/70 border-slate-100 opacity-70"
                    : canClaim
                    ? "bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-400/20 shadow-md shadow-emerald-500/10"
                    : "bg-white border-slate-100 hover:border-slate-200"
                }`}
              >
                {/* Left: Quest Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {quest.type === "daily" ? t("rewards.daily", "Harian") : t("rewards.weekly", "Mingguan")}
                    </span>
                    <span className="text-xs font-bold text-[#00685F] bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                      +{quest.xp_reward} XP
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 leading-snug">
                    {quest.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {quest.description}
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-1 pt-1 max-w-md">
                    <div className="flex justify-between text-[11px] font-bold text-slate-400">
                      <span>{t("rewards.progress", "Progres")}</span>
                      <span>{quest.current_count} / {quest.target_count} ({percent}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
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
                <div className="shrink-0 self-end sm:self-center">
                  {quest.is_claimed ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-100">
                      <Check className="w-4 h-4" />
                      <span>{t("rewards.claimed", "Telah Diklaim")}</span>
                    </div>
                  ) : canClaim ? (
                    <button
                      type="button"
                      onClick={() => handleClaim(quest.id)}
                      disabled={claimingId === quest.id}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-[#00A896] hover:from-emerald-700 hover:to-[#008f80] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {claimingId === quest.id ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-amber-300" />
                      )}
                      <span>{t("rewards.claim_reward", "Klaim Hadiah")}</span>
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3.5 py-2 rounded-xl block text-center">
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
