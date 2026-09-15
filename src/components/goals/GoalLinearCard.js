"use client";

import { 
  Laptop, 
  Plane, 
  GraduationCap, 
  Target, 
  Shield, 
  Heart, 
  Car, 
  Home, 
  Calendar, 
  CreditCard, 
  BarChart2, 
  CheckCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Pin
} from "lucide-react";
import GoalOptionsMenu from "./GoalOptionsMenu";

const iconMap = {
  laptop: Laptop,
  plane: Plane,
  graduation: GraduationCap,
  target: Target,
  shield: Shield,
  heart: Heart,
  car: Car,
  home: Home
};

export default function GoalLinearCard({
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
      <div className="lg:col-span-2 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-12 text-slate-400 text-sm font-bold">
        {t("goals.no_main_goal") || "Belum ada Target Utama. Buat baru!"}
      </div>
    );
  }

  const IconComponent = iconMap[goal.icon] || Target;
  const percent = getPercent(goal);

  return (
    <div className="lg:col-span-2 bg-white p-4 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 sm:space-y-10 hover:shadow-md transition-all duration-300 relative group overflow-hidden">
      {/* Header layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-3 sm:gap-5 w-full">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#00685F] to-[#004D46] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#00685F]/20 shrink-0">
            <IconComponent className="w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight truncate leading-tight">{goal.title}</h3>
              {goal.is_pinned && (
                <span className="bg-amber-50 text-amber-600 text-[10px] font-black px-2 py-0.5 rounded-lg border border-amber-200/60 flex items-center gap-1 shrink-0 select-none">
                  <Pin className="w-3 h-3 fill-amber-600 rotate-45" /> {t("goals.pinned") || "PINNED"}
                </span>
              )}
            </div>
            <p className="text-gray-400 font-semibold text-xs sm:text-sm truncate mt-0.5">{goal.subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto shrink-0 select-none border-t sm:border-t-0 border-slate-50 pt-2 sm:pt-0">
          {percent >= 100 ? (
            <span className="bg-emerald-50 text-emerald-600 text-[10px] sm:text-xs font-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-emerald-100 flex items-center gap-1.5 animate-pulse">
              <CheckCircle className="w-3.5 h-3.5" /> {t("goals.achieved") || "Achieved"}
            </span>
          ) : (
            <span className="bg-[#00685F]/5 text-[#00685F] text-[10px] sm:text-xs font-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-[#00685F]/10">
              {percent}% {language === 'en' ? "Completed" : "Selesai"}
            </span>
          )}
          
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div className="space-y-1.5">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest select-none">{t("goals.current_progress") || "Progress Saat Ini"}</p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <h4 className="text-2xl sm:text-4xl font-black text-[#00685F] tracking-tighter">{formatCurrency(goal.current)}</h4>
            <span className="text-gray-300 font-bold text-xs sm:text-sm">/ {formatCurrency(goal.target)}</span>
          </div>
        </div>
        <div className="flex flex-col md:items-end gap-1 select-none">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left md:text-right">{t("goals.deadline") || "Deadline"}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="font-bold text-slate-900 text-xs sm:text-sm">{goal.deadlineDate}</span>
            <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">
              {goal.deadlineText}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="w-full bg-slate-50 h-3.5 rounded-full overflow-hidden relative border border-slate-100/50">
          <div 
            className={`h-full shadow-sm transition-all duration-1000 ease-out rounded-full ${
              percent >= 100 
                ? "bg-gradient-to-r from-emerald-400 to-teal-500 shadow-lg shadow-emerald-400/20"
                : "bg-gradient-to-r from-[#00685F] to-[#008A7E]"
            }`}
            style={{ width: `${Math.min(percent, 100)}%` }}
          ></div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            type="button"
            onClick={() => openDepositModal(goal, "deposit")}
            className="flex-1 bg-[#1A1A1A] hover:bg-black text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-md text-sm select-none"
          >
            <CreditCard className="w-4.5 h-4.5" /> 
            <span>{t("goals.deposit") || "Setor Tabungan"}</span>
          </button>
          <button 
            type="button"
            onClick={() => openDepositModal(goal, "withdraw")}
            className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/70 px-4 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer text-sm select-none shrink-0"
          >
            {t("goals.withdraw") || "Tarik Dana"}
          </button>
          <button 
            type="button"
            onClick={() => toggleInsight(goal.id)}
            className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-900 px-5 py-3.5 rounded-2xl font-bold border border-slate-100 transition-colors active:scale-[0.98] cursor-pointer text-sm select-none shrink-0"
          >
            <BarChart2 className="w-4.5 h-4.5 text-[#00685F]" /> 
            <span>{t("goals.insight") || "Insight"}</span>
            {showInsight ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Interactive Slide-down Insight Panel */}
      {showInsight && (
        <div className="bg-[#E6F0EF]/40 border border-[#00685F]/10 rounded-2xl p-4.5 text-xs sm:text-sm font-semibold text-[#004D46] animate-in slide-in-from-top-3 duration-250 flex items-start gap-2.5 leading-relaxed">
          <Sparkles className="w-5 h-5 text-[#00685F] shrink-0 mt-0.5" />
          <span>{calculateInsightText(goal)}</span>
        </div>
      )}

      {/* Golden background aura when completed */}
      {percent >= 100 && (
        <div className="absolute -right-16 -top-16 w-32 h-32 bg-emerald-400/5 rounded-full blur-3xl select-none"></div>
      )}
    </div>
  );
}
