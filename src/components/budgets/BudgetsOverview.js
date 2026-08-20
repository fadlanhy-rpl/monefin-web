import { ArrowRight, Lightbulb } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../hooks/useCurrency";

export default function BudgetsOverview({
  isVisible,
  overallPercentage,
  remainingBudget,
  totalLimit,
  totalSpent,
  circumference,
  strokeDashoffset
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

      {/* Smart Saving Tip Card */}
      <div className="bg-brand-50/40 p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-brand-100/30 flex flex-col sm:flex-row gap-6 relative overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <div className="space-y-4 relative z-10 w-full">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">{language === 'en' ? "Smart Saving Tip" : "Tips Hemat Cerdas"}</h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm">
            {language === 'en' 
              ? "Based on your current dining trends, switching to home cooking on weekends could save you Rp 450,000 next month." 
              : "Berdasarkan tren pengeluaran makan di luar, beralih ke masak sendiri di akhir pekan dapat menghemat Rp 450.000 bulan depan."}
          </p>
          <button className="flex items-center gap-2 text-brand-600 font-bold text-xs sm:text-sm group cursor-pointer hover:underline">
            {language === 'en' ? "Enable Auto-Savings" : "Aktifkan Tabungan Otomatis"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="absolute -right-8 -bottom-8 opacity-20 text-[#00685F] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none">
          <Lightbulb style={{ width: "160px", height: "160px" }} />
        </div>
      </div>
    </div>
  );
}
