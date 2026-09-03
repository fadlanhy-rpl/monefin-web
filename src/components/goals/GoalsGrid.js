import { 
  Laptop, 
  Plane, 
  GraduationCap, 
  Target, 
  Shield, 
  ShieldCheck,
  Heart, 
  Car, 
  Home, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Calendar, 
  CreditCard, 
  BarChart2, 
  CheckCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Pin
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../hooks/useCurrency";

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

/**
 * Modern floating options popover for goal cards
 */
function GoalOptionsMenu({
  goal,
  isOpen,
  onToggle,
  onEdit,
  onDelete,
  onTogglePin,
  language,
  t
}) {
  return (
    <div className="relative z-30">
      <button 
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(goal.id);
        }}
        className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-all duration-200 cursor-pointer flex items-center justify-center"
        aria-label="Options"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop for click away */}
          <div 
            className="fixed inset-0 z-40 cursor-default" 
            onClick={(e) => {
              e.stopPropagation();
              onToggle(goal.id);
            }} 
          />
          
          {/* Modern Popover */}
          <div className="absolute right-0 mt-2 w-40 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-900/15 border border-slate-100/90 p-1.5 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-black/5 select-none">
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(goal);
                onToggle(goal.id);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-amber-50 text-slate-700 hover:text-amber-700 flex items-center gap-2.5 transition-all duration-150 cursor-pointer group/btn"
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${goal.is_pinned ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500 group-hover/btn:bg-amber-100 group-hover/btn:text-amber-600"}`}>
                <Pin className={`w-3 h-3 rotate-45 ${goal.is_pinned ? "fill-amber-600" : ""}`} />
              </div>
              <span className="truncate">{language === 'en' ? (goal.is_pinned ? "Unpin Goal" : "Pin Goal") : (goal.is_pinned ? "Lepas Semat" : "Sematkan")}</span>
            </button>

            <div className="h-px bg-slate-100 my-1 mx-1" />

            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(goal);
                onToggle(goal.id);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-emerald-50 text-slate-700 hover:text-[#00685F] flex items-center gap-2.5 transition-all duration-150 cursor-pointer group/btn"
            >
              <div className="w-6 h-6 rounded-lg bg-slate-100 group-hover/btn:bg-emerald-100 flex items-center justify-center text-slate-500 group-hover/btn:text-[#00685F] transition-colors shrink-0">
                <Pencil className="w-3 h-3" />
              </div>
              <span className="truncate">{t("common.edit") || (language === 'en' ? "Edit" : "Ubah")}</span>
            </button>

            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(goal.id);
                onToggle(goal.id);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-rose-50 text-slate-700 hover:text-rose-600 flex items-center gap-2.5 transition-all duration-150 cursor-pointer group/btn"
            >
              <div className="w-6 h-6 rounded-lg bg-slate-100 group-hover/btn:bg-rose-100 flex items-center justify-center text-slate-500 group-hover/btn:text-rose-600 transition-colors shrink-0">
                <Trash2 className="w-3 h-3" />
              </div>
              <span className="truncate">{t("common.delete") || (language === 'en' ? "Delete" : "Hapus")}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function GoalsGrid({
  goals,
  openEditModal,
  handleDelete,
  openDepositModal,
  handleTogglePin
}) {
  const { t, language } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [insightExpandedId, setInsightExpandedId] = useState(null);
  const [showInsightId, setShowInsightId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const toggleMenu = (id) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const toggleInsight = (id) => {
    setShowInsightId(showInsightId === id ? null : id);
  };

  const getPercent = (g) => {
    if (!g) return 0;
    return g.target > 0 ? Math.round((g.current / g.target) * 100) : 0;
  };

  const renderGoalIcon = (iconName) => {
    const IconComponent = iconMap[iconName] || Target;
    return <IconComponent className="w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 text-white" />;
  };

  const calculateInsightText = (g) => {
    const remaining = g.target - g.current;
    if (remaining <= 0) {
      return t("goals.congratulations") || (language === "en" ? "Congratulations! Your savings goal has been fully reached. Time to enjoy the fruit of your hard work!" : "Selamat! Target tabungan Anda sudah tercapai sepenuhnya. Waktunya menikmati hasil usaha Anda!");
    }
    const months = Math.ceil(remaining / 850000);
    const p1 = t("goals.insight_calculation_p1") || (language === "en" ? `With the current average saving rate of ${formatCurrency(850000)}/mo, you need approximately` : `Dengan rata-rata menabung ${formatCurrency(850000)}/bln saat ini, Anda butuh sekitar`);
    const p2 = t("goals.insight_calculation_p2") || (language === "en" ? "more months to reach the target of" : "bulan lagi untuk mencapai target");
    const p3 = t("goals.insight_calculation_p3") || (language === "en" ? ". Keep up the great consistency." : ". Pertahankan konsistensi menabung Anda.");
    return `${p1} ${months} ${p2} ${formatCurrency(g.target)}${p3}`;
  };

  const getDeadlineText = (deadline) => {
    if (!deadline) return language === 'en' ? "Ongoing" : "Sedang Berjalan";
    const now = new Date();
    const d = new Date(deadline);
    const months = (d.getFullYear() - now.getFullYear()) * 12 + d.getMonth() - now.getMonth();
    if (months <= 0) return language === 'en' ? "This month" : "Bulan ini";
    return language === 'en' ? `${months} mos left` : `${months} bln lagi`;
  };

  const mapGoal = (g) => {
    if (!g) return null;
    return {
      ...g,
      title: g.name,
      subtitle: g.description,
      current: parseFloat(g.current_amount) || 0,
      target: parseFloat(g.target_amount) || 0,
      deadlineDate: g.deadline ? new Date(g.deadline).toLocaleDateString(language === 'en' ? 'en-US' : 'id-ID', {day: 'numeric', month: 'short', year: 'numeric'}) : (language === 'en' ? "Ongoing" : "Sedang Berjalan"),
      deadlineText: getDeadlineText(g.deadline),
      type: g.layout_type || "linear",
      tag: g.color || "Safety",
      icon: g.icon || "target",
      is_pinned: Boolean(g.is_pinned),
      statusText: (parseFloat(g.current_amount) >= parseFloat(g.target_amount)) ? (language === 'en' ? "Achieved" : "Tercapai") : (language === 'en' ? "Stable" : "Stabil")
    };
  };

  const mappedGoals = goals.map(mapGoal);

  // Pinning logic: Priority Page 1 slot assignment
  const pinnedLinear = mappedGoals.find(g => g.is_pinned && g.type === "linear");
  const pinnedCircular = mappedGoals.find(g => g.is_pinned && g.type === "circular");

  // Page 1 slots
  const page1Left = pinnedLinear || mappedGoals.find(g => g.type === "linear") || mappedGoals[0];
  const page1Right = pinnedCircular || mappedGoals.find(g => g.id !== page1Left?.id && g.type === "circular") || mappedGoals.find(g => g.id !== page1Left?.id);

  const page1Goals = [page1Left, page1Right].filter(Boolean);
  const page1Ids = new Set(page1Goals.map(g => g.id));

  // Remaining goals for page 2+
  const otherGoals = mappedGoals.filter(g => !page1Ids.has(g.id));

  const itemsPerPage = 2;
  const totalPages = Math.max(1, 1 + Math.ceil(otherGoals.length / itemsPerPage));

  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    }
  }, [mappedGoals.length, totalPages, currentPage]);

  let currentGoals = [];
  if (currentPage === 0) {
    currentGoals = page1Goals;
  } else {
    currentGoals = otherGoals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }

  const leftGoal = currentGoals.find(g => g?.type === "linear") || currentGoals[0];
  const rightGoal = currentGoals.find(g => g?.id !== leftGoal?.id);

  return (
    <div className="space-y-4">
      {/* Pagination Slider Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1 select-none">
          <div className="text-xs font-bold text-slate-400">
            {t("goals.showing_page") || "Menampilkan"} {currentPage * itemsPerPage + 1} - {Math.min((currentPage + 1) * itemsPerPage, mappedGoals.length)} {t("goals.of") || "dari"} {mappedGoals.length} {t("goals.active_goals") || "Target Aktif"}
          </div>
          <div className="flex items-center gap-2">
            <button 
              type="button"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              className={`p-2 rounded-xl border border-slate-200 transition flex items-center justify-center ${currentPage === 0 ? "opacity-40 cursor-not-allowed bg-slate-50 text-slate-300" : "bg-white text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs"}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-extrabold text-slate-800 px-1">
              {t("goals.page") || "Halaman"} {currentPage + 1} / {totalPages}
            </span>
            <button 
              type="button"
              disabled={currentPage >= totalPages - 1}
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              className={`p-2 rounded-xl border border-slate-200 transition flex items-center justify-center ${currentPage >= totalPages - 1 ? "opacity-40 cursor-not-allowed bg-slate-50 text-slate-300" : "bg-white text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs"}`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
      {/* MAIN GOAL CARD (Left) */}
      {leftGoal ? (
        <div className="lg:col-span-2 bg-white p-4 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 sm:space-y-10 hover:shadow-md transition-all duration-300 relative group overflow-hidden">
          {/* Header layout */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex items-center gap-3 sm:gap-5 w-full">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#00685F] to-[#004D46] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#00685F]/20 shrink-0">
                {renderGoalIcon(leftGoal.icon || "laptop")}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight truncate leading-tight">{leftGoal.title}</h3>
                  {leftGoal.is_pinned && (
                    <span className="bg-amber-50 text-amber-600 text-[10px] font-black px-2 py-0.5 rounded-lg border border-amber-200/60 flex items-center gap-1 shrink-0 select-none">
                      <Pin className="w-3 h-3 fill-amber-600 rotate-45" /> {t("goals.pinned") || "PINNED"}
                    </span>
                  )}
                </div>
                <p className="text-gray-400 font-semibold text-xs sm:text-sm truncate mt-0.5">{leftGoal.subtitle}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto shrink-0 select-none border-t sm:border-t-0 border-slate-50 pt-2 sm:pt-0">
              {getPercent(leftGoal) >= 100 ? (
                <span className="bg-emerald-50 text-emerald-600 text-[10px] sm:text-xs font-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-emerald-100 flex items-center gap-1.5 animate-pulse">
                  <CheckCircle className="w-3.5 h-3.5" /> {t("goals.achieved") || "Achieved"}
                </span>
              ) : (
                <span className="bg-[#00685F]/5 text-[#00685F] text-[10px] sm:text-xs font-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-[#00685F]/10">
                  {getPercent(leftGoal)}% {language === 'en' ? "Completed" : "Selesai"}
                </span>
              )}
              
              {/* Menu options */}
              <GoalOptionsMenu 
                goal={leftGoal}
                isOpen={activeMenuId === leftGoal.id}
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
                <h4 className="text-2xl sm:text-4xl font-black text-[#00685F] tracking-tighter">{formatCurrency(leftGoal.current)}</h4>
                <span className="text-gray-300 font-bold text-xs sm:text-sm">/ {formatCurrency(leftGoal.target)}</span>
              </div>
            </div>
            <div className="flex flex-col md:items-end gap-1 select-none">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left md:text-right">{t("goals.deadline") || "Deadline"}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-slate-900 text-xs sm:text-sm">{leftGoal.deadlineDate}</span>
                <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">
                  {leftGoal.deadlineText}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="w-full bg-slate-50 h-3.5 rounded-full overflow-hidden relative border border-slate-100/50">
              <div 
                className={`h-full shadow-sm transition-all duration-1000 ease-out rounded-full ${
                  getPercent(leftGoal) >= 100 
                    ? "bg-gradient-to-r from-emerald-400 to-teal-500 shadow-lg shadow-emerald-400/20"
                    : "bg-gradient-to-r from-[#00685F] to-[#008A7E]"
                }`}
                style={{ width: `${Math.min(getPercent(leftGoal), 100)}%` }}
              ></div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                type="button"
                onClick={() => openDepositModal(leftGoal, "deposit")}
                className="flex-1 bg-[#1A1A1A] hover:bg-black text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-md text-sm select-none"
              >
                <CreditCard className="w-4.5 h-4.5" /> 
                <span>{t("goals.deposit") || "Setor Tabungan"}</span>
              </button>
              <button 
                type="button"
                onClick={() => openDepositModal(leftGoal, "withdraw")}
                className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/70 px-4 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer text-sm select-none shrink-0"
              >
                {t("goals.withdraw") || "Tarik Dana"}
              </button>
              <button 
                type="button"
                onClick={() => toggleInsight(leftGoal.id)}
                className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-900 px-5 py-3.5 rounded-2xl font-bold border border-slate-100 transition-colors active:scale-[0.98] cursor-pointer text-sm select-none shrink-0"
              >
                <BarChart2 className="w-4.5 h-4.5 text-[#00685F]" /> 
                <span>{t("goals.insight") || "Insight"}</span>
                {showInsightId === leftGoal.id ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
              </button>
            </div>
          </div>

          {/* Interactive Slide-down Insight Panel */}
          {showInsightId === leftGoal.id && (
            <div className="bg-[#E6F0EF]/40 border border-[#00685F]/10 rounded-2xl p-4.5 text-xs sm:text-sm font-semibold text-[#004D46] animate-in slide-in-from-top-3 duration-250 flex items-start gap-2.5 leading-relaxed">
              <Sparkles className="w-5 h-5 text-[#00685F] shrink-0 mt-0.5" />
              <span>{calculateInsightText(leftGoal)}</span>
            </div>
          )}

          {/* Golden background aura when completed */}
          {getPercent(leftGoal) >= 100 && (
            <div className="absolute -right-16 -top-16 w-32 h-32 bg-emerald-400/5 rounded-full blur-3xl select-none"></div>
          )}
        </div>
      ) : (
        <div className="lg:col-span-2 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-12 text-slate-400 text-sm font-bold">
          {t("goals.no_main_goal") || "Belum ada Target Utama. Buat baru!"}
        </div>
      )}

      {/* SIDE GOAL CARD (Right - Circular Progress Card) */}
      {rightGoal ? (
        <div className="bg-white p-4 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 relative group overflow-hidden">
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0 flex-1 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg truncate">{rightGoal.title}</h3>
                {rightGoal.is_pinned && (
                  <span className="bg-amber-50 text-amber-600 text-[9px] font-black px-1.5 py-0.5 rounded-md border border-amber-200/60 flex items-center gap-0.5 shrink-0 select-none">
                    <Pin className="w-2.5 h-2.5 fill-amber-600 rotate-45" /> {t("goals.pinned") || "PINNED"}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 select-none">
              <span className="bg-[#00685F]/5 text-[#00685F] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter">
                {(rightGoal.tag || "Safety") === "Safety" ? (language === 'en' ? "Safety" : "Keamanan") : rightGoal.tag}
              </span>
              
              {/* Menu options */}
              <GoalOptionsMenu 
                goal={rightGoal}
                isOpen={activeMenuId === rightGoal.id}
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
                  stroke={getPercent(rightGoal) >= 100 ? "#10B981" : "#00685F"} 
                  strokeWidth="12" 
                  fill="transparent" 
                  strokeDasharray="440" 
                  strokeDashoffset={440 - (440 * Math.min(getPercent(rightGoal), 100)) / 100} 
                  strokeLinecap="round" 
                  className="transition-all duration-1000 ease-out" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">{getPercent(rightGoal)}%</span>
                {getPercent(rightGoal) >= 100 && (
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
                  {(rightGoal.statusText || "Stable") === "Stable" ? (language === 'en' ? "Stable" : "Stabil") : 
                   (rightGoal.statusText === "On Track" ? (language === 'en' ? "On Track" : "Sesuai Target") : 
                   (rightGoal.statusText === "At Risk" ? (language === 'en' ? "At Risk" : "Beresiko") : rightGoal.statusText))}
                </span>
              </div>
              <button 
                type="button"
                onClick={() => toggleInsight(rightGoal.id)}
                className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition flex items-center gap-0.5 select-none cursor-pointer"
              >
                {t("goals.insight") || "Insight"}
                {showInsightId === rightGoal.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {/* Circular Card Insight Panel */}
            {showInsightId === rightGoal.id && (
              <div className="bg-[#E6F0EF]/40 border border-[#00685F]/10 rounded-xl p-3 text-[11px] font-semibold text-[#004D46] animate-in slide-in-from-top-2 duration-200 leading-normal">
                {calculateInsightText(rightGoal)}
              </div>
            )}
            
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 select-none">{t("goals.total_savings") || "Total Tabungan"}</p>
              <h4 className="text-xl font-black text-slate-900 tracking-tight">{formatCurrency(rightGoal.current)}</h4>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5 tracking-tight select-none">{t("goals.goal") || "Goal"}: {formatCurrency(rightGoal.target)}</p>
            </div>
            
            <div className="flex justify-between items-center select-none text-[10px] pt-1 flex-wrap gap-2">
              <span className="text-gray-400 font-bold">{t("goals.deadline") || "Deadline"}: {rightGoal.deadlineDate || (language === 'en' ? "Ongoing" : "Sedang Berjalan")}</span>
              <span className="text-[#00685F] font-black uppercase tracking-wider text-[9px]">{t("goals.high_priority") || "High Priority"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button 
                type="button"
                onClick={() => openDepositModal(rightGoal, "deposit")}
                className="border-2 border-[#00685F] bg-[#00685F] text-white hover:bg-[#004D46] hover:border-[#004D46] py-2.5 rounded-xl font-bold transition-all active:scale-[0.97] cursor-pointer text-xs select-none"
              >
                {t("goals.deposit") || "Setor Tabungan"}
              </button>
              <button 
                type="button"
                onClick={() => openDepositModal(rightGoal, "withdraw")}
                className="border border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100 py-2.5 rounded-xl font-bold transition-all active:scale-[0.97] cursor-pointer text-xs select-none"
              >
                {t("goals.withdraw") || "Tarik Dana"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-12 text-slate-400 text-sm font-bold">
          {t("goals.no_side_goal") || "Belum ada Target Cadangan. Buat baru!"}
        </div>
      )}
    </div>
    </div>
  );
}
