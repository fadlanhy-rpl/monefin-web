"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../hooks/useCurrency";
import GoalLinearCard from "./GoalLinearCard";
import GoalCircularCard from "./GoalCircularCard";
import GoalsEmptyState from "./GoalsEmptyState";

export default function GoalsGrid({
  goals,
  openEditModal,
  handleDelete,
  openDepositModal,
  handleTogglePin,
  openAddModal,
  isFiltered = false,
  searchQuery = "",
  onResetSearch,
}) {
  const { t, language } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [showInsightId, setShowInsightId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  if (!goals || goals.length === 0) {
    return (
      <GoalsEmptyState
        isFiltered={isFiltered}
        searchQuery={searchQuery}
        onResetSearch={onResetSearch}
        onAddGoal={openAddModal}
      />
    );
  }

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

  const safeCurrentPage = Math.min(currentPage, Math.max(0, totalPages - 1));

  let currentGoals = [];
  if (safeCurrentPage === 0) {
    currentGoals = page1Goals;
  } else {
    currentGoals = otherGoals.slice((safeCurrentPage - 1) * itemsPerPage, safeCurrentPage * itemsPerPage);
  }

  const leftGoal = currentGoals.find(g => g?.type === "linear") || currentGoals[0];
  const rightGoal = currentGoals.find(g => g?.id !== leftGoal?.id);

  return (
    <div className="space-y-4">
      {/* Pagination Slider Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1 select-none">
          <div className="text-xs font-bold text-slate-400">
            {t("goals.showing_page") || "Menampilkan"} {safeCurrentPage * itemsPerPage + 1} - {Math.min((safeCurrentPage + 1) * itemsPerPage, mappedGoals.length)} {t("goals.of") || "dari"} {mappedGoals.length} {t("goals.active_goals") || "Target Aktif"}
          </div>
          <div className="flex items-center gap-2">
            <button 
              type="button"
              disabled={safeCurrentPage === 0}
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              className={`p-2 rounded-xl border border-slate-200 transition flex items-center justify-center ${safeCurrentPage === 0 ? "opacity-40 cursor-not-allowed bg-slate-50 text-slate-300" : "bg-white text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs"}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-extrabold text-slate-800 px-1">
              {t("goals.page") || "Halaman"} {safeCurrentPage + 1} / {totalPages}
            </span>
            <button 
              type="button"
              disabled={safeCurrentPage >= totalPages - 1}
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              className={`p-2 rounded-xl border border-slate-200 transition flex items-center justify-center ${safeCurrentPage >= totalPages - 1 ? "opacity-40 cursor-not-allowed bg-slate-50 text-slate-300" : "bg-white text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs"}`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <GoalLinearCard
          goal={leftGoal}
          activeMenuId={activeMenuId}
          toggleMenu={toggleMenu}
          openEditModal={openEditModal}
          handleDelete={handleDelete}
          handleTogglePin={handleTogglePin}
          openDepositModal={openDepositModal}
          showInsight={showInsightId === leftGoal?.id}
          toggleInsight={toggleInsight}
          calculateInsightText={calculateInsightText}
          getPercent={getPercent}
          formatCurrency={formatCurrency}
          language={language}
          t={t}
        />

        <GoalCircularCard
          goal={rightGoal}
          activeMenuId={activeMenuId}
          toggleMenu={toggleMenu}
          openEditModal={openEditModal}
          handleDelete={handleDelete}
          handleTogglePin={handleTogglePin}
          openDepositModal={openDepositModal}
          showInsight={showInsightId === rightGoal?.id}
          toggleInsight={toggleInsight}
          calculateInsightText={calculateInsightText}
          getPercent={getPercent}
          formatCurrency={formatCurrency}
          language={language}
          t={t}
        />
      </div>
    </div>
  );
}
