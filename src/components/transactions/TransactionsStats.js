import { Wallet, ShoppingCart, BarChart3, TrendingUp, TrendingDown, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../hooks/useCurrency";
import { useBalancePrivacy } from "../../context/BalancePrivacyContext";

export default function TransactionsStats({ totalIncome, totalExpenses, netCashFlow, isVisible }) {
  const { t, language } = useLanguage();
  const { formatCurrency } = useCurrency();
  const { isBalanceHidden, toggleBalancePrivacy } = useBalancePrivacy();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
      {/* Income Card */}
      <div className={`bg-white p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[148px] sm:min-h-[160px] relative overflow-hidden transition-all duration-700 delay-100 ease-out transform hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="flex justify-between items-start gap-2.5 relative z-10">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{t("transactions.total_income") || "Total Income"}</p>
              <button
                type="button"
                onClick={toggleBalancePrivacy}
                className="p-0.5 text-slate-300 hover:text-emerald-600 rounded transition-colors cursor-pointer shrink-0"
                title={isBalanceHidden ? (language === "en" ? "Show Amounts" : "Tampilkan Nominal") : (language === "en" ? "Hide Amounts" : "Sembunyikan Nominal")}
              >
                {isBalanceHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </button>
            </div>
            <h3 
              className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 mt-1.5 sm:mt-2 font-mono sm:font-sans tracking-tight break-normal"
              title={isBalanceHidden ? undefined : formatCurrency(totalIncome)}
            >
              {isBalanceHidden ? "••••••••" : formatCurrency(totalIncome)}
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5 sm:mt-1 truncate">{t("transactions.this_current_month") || "This current month"}</p>
          </div>
          <div className="p-2 sm:p-2.5 bg-emerald-50 text-emerald-600 rounded-xl transition-transform duration-300 hover:scale-110 hover:rotate-6 shrink-0">
            <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
        <div className="flex items-center gap-2 self-start bg-emerald-50 px-2 py-1 rounded-lg z-10 mt-2">
          <TrendingUp className="w-3 h-3 text-emerald-600 shrink-0" />
          <span className="text-[10px] font-black text-emerald-600">12.5%</span>
        </div>

        {/* Sparkline graphic at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden pointer-events-none rounded-b-2xl sm:rounded-b-[2rem]">
          <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
            <defs>
              <linearGradient id="income-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.15"/>
                <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d="M 0 24 C 20 24, 35 16, 50 18 C 65 20, 80 8, 100 12" fill="none" stroke="#10b981" strokeWidth="1.5" className="sparkline-path" />
            <path d="M 0 24 C 20 24, 35 16, 50 18 C 65 20, 80 8, 100 12 L 100 30 L 0 30 Z" fill="url(#income-grad)" />
          </svg>
        </div>
      </div>

      {/* Expenses Card */}
      <div className={`bg-white p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[148px] sm:min-h-[160px] relative overflow-hidden transition-all duration-700 delay-200 ease-out transform hover:-translate-y-1 hover:shadow-xl hover:shadow-red-500/5 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="flex justify-between items-start gap-2.5 relative z-10">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{t("transactions.total_expenses") || "Total Expenses"}</p>
              <button
                type="button"
                onClick={toggleBalancePrivacy}
                className="p-0.5 text-slate-300 hover:text-red-600 rounded transition-colors cursor-pointer shrink-0"
                title={isBalanceHidden ? (language === "en" ? "Show Amounts" : "Tampilkan Nominal") : (language === "en" ? "Hide Amounts" : "Sembunyikan Nominal")}
              >
                {isBalanceHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </button>
            </div>
            <h3 
              className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 mt-1.5 sm:mt-2 font-mono sm:font-sans tracking-tight break-normal"
              title={isBalanceHidden ? undefined : formatCurrency(totalExpenses)}
            >
              {isBalanceHidden ? "••••••••" : formatCurrency(totalExpenses)}
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5 sm:mt-1 truncate">{t("transactions.this_current_month") || "This current month"}</p>
          </div>
          <div className="p-2 sm:p-2.5 bg-red-50 text-red-600 rounded-xl transition-transform duration-300 hover:scale-110 hover:-rotate-6 shrink-0">
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
        <div className="flex items-center gap-2 self-start bg-red-50 px-2 py-1 rounded-lg z-10 mt-2">
          <TrendingDown className="w-3 h-3 text-red-600 shrink-0" />
          <span className="text-[10px] font-black text-red-600">3.2%</span>
        </div>

        {/* Sparkline graphic at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden pointer-events-none rounded-b-2xl sm:rounded-b-[2rem]">
          <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
            <defs>
              <linearGradient id="expense-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.15"/>
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d="M 0 8 C 20 8, 35 18, 50 16 C 65 14, 80 24, 100 20" fill="none" stroke="#ef4444" strokeWidth="1.5" className="sparkline-path" />
            <path d="M 0 8 C 20 8, 35 18, 50 16 C 65 14, 80 24, 100 20 L 100 30 L 0 30 Z" fill="url(#expense-grad)" />
          </svg>
        </div>
      </div>

      {/* Net Cash Card - Spans 2 cols on tablet for optimal width */}
      <div className={`sm:col-span-2 xl:col-span-1 bg-[#E6F0EF]/60 p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-[2rem] border border-[#c0ded9]/50 shadow-sm flex flex-col justify-between min-h-[148px] sm:min-h-[160px] relative overflow-hidden transition-all duration-700 delay-300 ease-out transform hover:-translate-y-1 hover:shadow-xl hover:shadow-[#00685F]/5 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="flex justify-between items-start gap-2.5 relative z-10">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-[10px] font-black text-[#00685F] uppercase tracking-widest truncate">{t("transactions.net_cash_flow") || "Net Cash Flow"}</p>
              <button
                type="button"
                onClick={toggleBalancePrivacy}
                className="p-0.5 text-[#00685F]/50 hover:text-[#00685F] rounded transition-colors cursor-pointer shrink-0"
                title={isBalanceHidden ? (language === "en" ? "Show Amounts" : "Tampilkan Nominal") : (language === "en" ? "Hide Amounts" : "Sembunyikan Nominal")}
              >
                {isBalanceHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </button>
            </div>
            <h3 
              className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 mt-1.5 sm:mt-2 font-mono sm:font-sans tracking-tight break-normal"
              title={isBalanceHidden ? undefined : formatCurrency(netCashFlow)}
            >
              {isBalanceHidden ? "••••••••" : formatCurrency(netCashFlow)}
            </h3>
            <p className="text-[10px] text-[#00685F]/70 mt-0.5 sm:mt-1 truncate">{t("transactions.estimated_savings") || "Estimated savings potential"}</p>
          </div>
          <div className="p-2 sm:p-2.5 bg-[#00685F] text-white rounded-xl relative z-10 transition-transform duration-300 hover:scale-110 hover:rotate-6 shrink-0">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
        <div className="flex -space-x-2 mt-2 relative z-10">
          <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 text-[8px] flex items-center justify-center font-bold text-slate-700 transition-transform duration-300 hover:scale-110">AT</div>
          <div className="w-6 h-6 rounded-full border-2 border-white bg-[#00685F] text-white text-[8px] flex items-center justify-center font-bold transition-transform duration-300 hover:scale-110">MF</div>
        </div>

        {/* Sparkline graphic at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden pointer-events-none rounded-b-2xl sm:rounded-b-[2rem]">
          <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
            <defs>
              <linearGradient id="net-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00685F" stopOpacity="0.15"/>
                <stop offset="100%" stopColor="#00685F" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d="M 0 20 C 20 20, 35 24, 50 16 C 65 8, 80 6, 100 8" fill="none" stroke="#00685F" strokeWidth="1.5" className="sparkline-path" />
            <path d="M 0 20 C 20 20, 35 24, 50 16 C 65 8, 80 6, 100 8 L 100 30 L 100 30 Z" fill="url(#net-grad)" />
          </svg>
        </div>
      </div>
    </div>
  );
}
