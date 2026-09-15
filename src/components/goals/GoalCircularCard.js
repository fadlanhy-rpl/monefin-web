"use client";

import { 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Pin 
} from "lucide-react";
import GoalOptionsMenu from "./GoalOptionsMenu";

export default function GoalCircularCard({
  goal,
  activeMenuId,
  toggleMenu,
  openEditModal,
  handleDelete,
  handleTogglePin,
  openDepositModal,
  showInsight,
  toggleInsight,
  calculateInsightText,
  getPercent,
  formatCurrency,
  language,
  t
}) {
  if (!goal) {
    return (
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-12 text-slate-400 text-sm font-bold">
        {t("goals.no_side_goal") || "Belum ada Target Cadangan. Buat baru!"}
      </div>
    );
  }

  const percent = getPercent(goal);

  return (
    <div className="bg-white p-4 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 relative group overflow-hidden">
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0 flex-1 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg truncate">{goal.title}</h3>
            {goal.is_pinned && (
              <span className="bg-amber-50 text-amber-600 text-[9px] font-black px-1.5 py-0.5 rounded-md border border-amber-200/60 flex items-center gap-0.5 shrink-0 select-none">
                <Pin className="w-2.5 h-2.5 fill-amber-600 rotate-45" /> {t("goals.pinned") || "PINNED"}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 select-none">
          <span className="bg-[#00685F]/5 text-[#00685F] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter">
            {(goal.tag || "Safety") === "Safety" ? (language === 'en' ? "Safety" : "Keamanan") : goal.tag}
          </span>
          
          <GoalOptionsMenu 
            goal={goal}
            isOpen={activeMenuId === goal.id}
            onToggle={toggleMenu}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onTogglePin={handleTogglePin}
            language={language}
            t={t}
          />
        </div>
      </div>

      {/* Donut Progress Chart */}
      <div className="flex justify-center py-5 sm:py-6 select-none">
        <div className="w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center relative transition-transform duration-300 group-hover:scale-105">
          <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90 filter drop-shadow-md">
            <circle cx="80" cy="80" r="70" stroke="#f8fafb" strokeWidth="12" fill="transparent" />
            <circle 
              cx="80" 
              cy="80" 
              r="70" 
              stroke={percent >= 100 ? "#10B981" : "#00685F"} 
              strokeWidth="12" 
              fill="transparent" 
              strokeDasharray="440" 
              strokeDashoffset={440 - (440 * Math.min(percent, 100)) / 100} 
              strokeLinecap="round" 
              className="transition-all duration-1000 ease-out" 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{percent}%</span>
            {percent >= 100 && (
              <span className="text-[7px] sm:text-[8px] font-black text-emerald-500 uppercase mt-0.5 tracking-widest">
                {t("goals.achieved") || "Achieved"}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#00685F]">
            <ShieldCheck className="w-4 h-4" /> Status: <span className="text-slate-900">
              {(goal.statusText || "Stable") === "Stable" ? (language === 'en' ? "Stable" : "Stabil") : 
               (goal.statusText === "On Track" ? (language === 'en' ? "On Track" : "Sesuai Target") : 
               (goal.statusText === "At Risk" ? (language === 'en' ? "At Risk" : "Beresiko") : goal.statusText))}
            </span>
          </div>
          <button 
            type="button"
            onClick={() => toggleInsight(goal.id)}
            className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition flex items-center gap-0.5 select-none cursor-pointer"
          >
            {t("goals.insight") || "Insight"}
            {showInsight ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Circular Card Insight Panel */}
        {showInsight && (
          <div className="bg-[#E6F0EF]/40 border border-[#00685F]/10 rounded-xl p-3 text-[11px] font-semibold text-[#004D46] animate-in slide-in-from-top-2 duration-200 leading-normal">
            {calculateInsightText(goal)}
          </div>
        )}
        
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 select-none">{t("goals.total_savings") || "Total Tabungan"}</p>
          <h4 className="text-xl font-black text-slate-900 tracking-tight">{formatCurrency(goal.current)}</h4>
          <p className="text-[10px] text-gray-400 font-semibold mt-0.5 tracking-tight select-none">{t("goals.goal") || "Goal"}: {formatCurrency(goal.target)}</p>
        </div>
        
        <div className="flex justify-between items-center select-none text-[10px] pt-1 flex-wrap gap-2">
          <span className="text-gray-400 font-bold">{t("goals.deadline") || "Deadline"}: {goal.deadlineDate || (language === 'en' ? "Ongoing" : "Sedang Berjalan")}</span>
          <span className="text-[#00685F] font-black uppercase tracking-wider text-[9px]">{t("goals.high_priority") || "High Priority"}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button 
            type="button"
            onClick={() => openDepositModal(goal, "deposit")}
            className="border-2 border-[#00685F] bg-[#00685F] text-white hover:bg-[#004D46] hover:border-[#004D46] py-2.5 rounded-xl font-bold transition-all active:scale-[0.97] cursor-pointer text-xs select-none"
          >
            {t("goals.deposit") || "Setor Tabungan"}
          </button>
          <button 
            type="button"
            onClick={() => openDepositModal(goal, "withdraw")}
            className="border border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100 py-2.5 rounded-xl font-bold transition-all active:scale-[0.97] cursor-pointer text-xs select-none"
          >
            {t("goals.withdraw") || "Tarik Dana"}
          </button>
        </div>
      </div>
    </div>
  );
}
