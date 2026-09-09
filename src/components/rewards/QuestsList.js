"use client";

import { useState, useMemo } from "react";
import { 
  Target, 
  Sparkles, 
  Clock, 
  Check, 
  Calendar, 
  Zap, 
  Trophy,
  CheckCircle2,
  ChevronDown
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { claimQuestReward } from "../../services/gamification.service";
import { getLocalizedQuest } from "../../lib/gamificationDictionary";
import toast from "react-hot-toast";

export default function QuestsList({ quests = [], onClaimSuccess }) {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'daily' | 'weekly'
  const [claimingId, setClaimingId] = useState(null);

  const questList = useMemo(() => {
    const list = Array.isArray(quests) ? quests : (quests ? Object.values(quests) : []);
    
    // Sort logic: 
    // 1. Ready to claim first (canClaim)
    // 2. In-progress next
    // 3. Already claimed at the end
    return [...list].sort((a, b) => {
      const aCanClaim = a.is_completed && !a.is_claimed;
      const bCanClaim = b.is_completed && !b.is_claimed;
      if (aCanClaim && !bCanClaim) return -1;
      if (!aCanClaim && bCanClaim) return 1;
      if (a.is_claimed && !b.is_claimed) return 1;
      if (!a.is_claimed && b.is_claimed) return -1;
      return 0;
    });
  }, [quests]);

  // Tab filtered quests
  const filteredQuests = useMemo(() => {
    if (activeTab === "daily") return questList.filter((q) => q.type === "daily");
    if (activeTab === "weekly") return questList.filter((q) => q.type === "weekly");
    return questList;
  }, [questList, activeTab]);

  // Counts & metrics
  const dailyCount = questList.filter((q) => q.type === "daily").length;
  const weeklyCount = questList.filter((q) => q.type === "weekly").length;
  const claimableCount = questList.filter((q) => q.is_completed && !q.is_claimed).length;
  const claimedCount = questList.filter((q) => q.is_claimed).length;
  const totalAvailableXp = questList
    .filter((q) => !q.is_claimed)
    .reduce((acc, q) => acc + (q.xp_reward || 0), 0);

  const handleClaim = async (questId) => {
    setClaimingId(questId);
    try {
      const res = await claimQuestReward(questId);
      toast.success(
        res.message || 
        (language === "en" ? "XP reward claimed successfully!" : "Hadiah XP berhasil diklaim!")
      );
      if (onClaimSuccess) {
        onClaimSuccess(res);
      }
    } catch (err) {
      toast.error(
        err?.data?.message || 
        (language === "en" ? "Failed to claim quest reward." : "Gagal mengklaim hadiah misi.")
      );
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className="bg-white p-5 sm:p-7 md:p-8 rounded-3xl sm:rounded-[2.25rem] border border-slate-100 shadow-sm space-y-6 overflow-hidden">
      
      {/* Header & Overview Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-teal-50 text-[#00685F] flex items-center justify-center shadow-2xs shrink-0 ring-4 ring-teal-50/50">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {t("rewards.quests_title", "Misi & Tantangan Finansial")}
              </h3>
              <span className="text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {questList.length} {t("rewards.quests_label", "Misi")}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {t("rewards.quests_desc", "Selesaikan misi harian & mingguan untuk meraih bonus XP berlimpah.")}
            </p>
          </div>
        </div>

        {/* Quick Badges / Metrics */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span className="text-xs font-black text-amber-900">
              +{totalAvailableXp} XP
            </span>
            <span className="text-[10px] text-amber-700 font-medium hidden sm:inline">
              {t("rewards.available", "Tersedia")}
            </span>
          </div>

          <div className="bg-emerald-50/80 border border-emerald-200/60 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-black text-emerald-900">
              {claimedCount}/{questList.length}
            </span>
            <span className="text-[10px] text-emerald-700 font-medium hidden sm:inline">
              {t("rewards.completed", "Selesai")}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Filter (Semua, Harian, Mingguan) */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="inline-flex p-1 bg-slate-100/90 rounded-2xl gap-1 text-xs font-extrabold text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "all"
                ? "bg-white text-slate-900 shadow-xs"
                : "hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <span>{t("rewards.tab_all", "Semua")}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === "all" ? "bg-slate-100 text-slate-800" : "bg-slate-200 text-slate-600"
            }`}>
              {questList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("daily")}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "daily"
                ? "bg-white text-slate-900 shadow-xs"
                : "hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <Clock className="w-3 h-3 text-orange-500" />
            <span>{t("rewards.daily", "Harian")}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === "daily" ? "bg-orange-100 text-orange-800" : "bg-slate-200 text-slate-600"
            }`}>
              {dailyCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("weekly")}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "weekly"
                ? "bg-white text-slate-900 shadow-xs"
                : "hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <Calendar className="w-3 h-3 text-teal-600" />
            <span>{t("rewards.weekly", "Mingguan")}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === "weekly" ? "bg-teal-100 text-teal-800" : "bg-slate-200 text-slate-600"
            }`}>
              {weeklyCount}
            </span>
          </button>
        </div>

        {claimableCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200/80 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{claimableCount} {t("rewards.ready_to_claim", "Hadiah Siap Diklaim!")}</span>
          </div>
        )}
      </div>

      {/* Quests List Container (Displays ~4 quests with smooth vertical scroll) */}
      <div className="space-y-3 sm:space-y-3.5 max-h-[515px] sm:max-h-[530px] overflow-y-auto pr-1.5 scroll-smooth [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
        {filteredQuests.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
            <Trophy className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600">
              {t("rewards.no_quests", "Tidak ada misi aktif di kategori ini.")}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {t("rewards.no_quests_sub", "Misi baru akan direset otomatis setiap awal hari atau pekan.")}
            </p>
          </div>
        ) : (
          filteredQuests.map((quest) => {
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
                    ? "bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-white border-emerald-300 ring-2 ring-emerald-400/20 shadow-xs"
                    : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-xs"
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

                    {canClaim && (
                      <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                        {t("rewards.badge_completed", "Tercapai")}
                      </span>
                    )}
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

      {/* Scroll indicator if more than 4 quests exist in the current tab */}
      {filteredQuests.length > 4 && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-100/80 text-[11px] text-slate-400 font-medium">
          <div className="flex items-center gap-1.5 text-slate-500">
            <ChevronDown className="w-3.5 h-3.5 text-[#00685F] animate-bounce" />
            <span>
              {language === "en" 
                ? `Scroll down to view ${filteredQuests.length - 4} more quests` 
                : `Gulir ke bawah untuk melihat ${filteredQuests.length - 4} misi lainnya`}
            </span>
          </div>
          <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-bold text-slate-600">
            4 / {filteredQuests.length} {language === "en" ? "visible" : "terlihat"}
          </span>
        </div>
      )}

    </div>
  );
}
