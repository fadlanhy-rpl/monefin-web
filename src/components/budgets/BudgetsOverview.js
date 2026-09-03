import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../hooks/useCurrency";
import SmartInsightCard from "../shared/SmartInsightCard";

export default function BudgetsOverview({
  isVisible,
  overallPercentage,
  remainingBudget,
  totalLimit,
  totalSpent,
  circumference,
  strokeDashoffset,
  openAddModal
}) {
  const { t, language } = useLanguage();
  const { formatCurrency } = useCurrency();

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 pb-10 transition-all duration-700 delay-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      {/* Spending Overview Card */}
      <div className="bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-6 sm:gap-8 items-center hover:shadow-lg transition-all duration-300 group overflow-hidden">
        <div className="flex-1 space-y-4 w-full">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">{t("dashboard.spending_analytics") || "Spending Overview"}</h3>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            {t("budgets.overview_insight_p1") || "You've spent"} {overallPercentage}{t("budgets.overview_insight_p2") || "% of your total monthly budget across all categories. You have"} {t("budgets.overview_insight_p3") || ""} {formatCurrency(remainingBudget)} {language === 'en' ? "remaining." : ""}
          </p>
          
          {/* Side-by-Side 2-Column Grid on all screen sizes with divide line */}
          <div className="grid grid-cols-2 divide-x divide-slate-100 pt-2 w-full select-none">
            <div className="pr-3 sm:pr-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t("budgets.total_budget") || "Total Budget"}</p>
              <p className="text-sm sm:text-lg font-black text-slate-900 mt-0.5 truncate">{formatCurrency(totalLimit)}</p>
            </div>
            <div className="pl-3 sm:pl-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t("budgets.total_spent") || "Total Spent"}</p>
              <p className="text-sm sm:text-lg font-black text-brand-600 mt-0.5 truncate">{formatCurrency(totalSpent)}</p>
            </div>
          </div>
        </div>
        
        {/* Donut Chart (Explicitly centered horizontally with mx-auto, and viewBox added to scale cleanly) */}
        <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex-shrink-0 cursor-pointer transition-transform duration-300 group-hover:scale-105 mx-auto sm:mx-0">
          <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
            <circle cx="80" cy="80" r="70" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
            <circle 
              cx="80" 
              cy="80" 
              r="70" 
              stroke="#00685F" 
              strokeWidth="12" 
              fill="transparent" 
              strokeDasharray={circumference} 
              strokeDashoffset={strokeDashoffset} 
              strokeLinecap="round" 
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{overallPercentage}%</span>
            <span className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-wider">{t("dashboard.expense") || "Spent"}</span>
          </div>
        </div>
      </div>

      {/* Smart Saving Tip Card — Dynamic (AI or Engine) */}
      <SmartInsightCard page="budgets" onActionClick={openAddModal} />
    </div>
  );
}
