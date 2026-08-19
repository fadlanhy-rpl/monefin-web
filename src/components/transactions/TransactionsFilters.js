import { ChevronDown, Check, Search, Download } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function TransactionsFilters({
  categoryIdFilter,
  setCategoryIdFilter,
  dateFilter,
  setDateFilter,
  accountIdFilter,
  setAccountIdFilter,
  searchQuery,
  setSearchQuery,
  handleExport,
  isVisible,
  isCategoryOpen,
  setIsCategoryOpen,
  isDateOpen,
  setIsDateOpen,
  isAccountOpen,
  setIsAccountOpen,
  categories = [],
  accounts = []
}) {
  const { t } = useLanguage();

  const selectedCategory = categories.find(c => String(c.id) === String(categoryIdFilter));
  const selectedAccount = accounts.find(a => String(a.id) === String(accountIdFilter));

  return (
    <div className={`bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap items-center gap-3 transition-all duration-700 delay-400 ease-out transform relative z-20 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">{t("transactions.filters") || "Filters"}</span>
      
      <div 
        onScroll={() => {
          setIsCategoryOpen(false);
          setIsDateOpen(false);
          setIsAccountOpen(false);
        }}
        className="flex flex-nowrap gap-1.5 overflow-x-auto py-2.5 -my-2.5 flex-1 relative z-30 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-3.5"
      >
        {/* Category Filter */}
        <div className="relative shrink-0">
          <button 
            type="button"
            onClick={() => {
              setIsCategoryOpen(!isCategoryOpen);
              setIsDateOpen(false);
              setIsAccountOpen(false);
            }}
            className="flex items-center justify-between gap-1.5 bg-slate-50 border border-slate-100 rounded-xl px-2 sm:px-3.5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all select-none cursor-pointer min-w-[95px] sm:min-w-[130px]"
          >
            <span className="truncate max-w-[100px]">Cat: {categoryIdFilter === "All" ? (t("transactions.cat_all") || "All") : selectedCategory?.name}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isCategoryOpen ? "rotate-180 text-[#00685F]" : ""}`} />
          </button>
          
          {isCategoryOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setIsCategoryOpen(false)} />
              <div className="dropdown-pop fixed mt-1.5 right-2 sm:right-auto bg-white border border-slate-100 rounded-2xl shadow-xl z-30 py-1.5 min-w-[170px] max-w-[calc(100vw-24px)] overflow-hidden max-h-56 overflow-y-auto">
                <button
                    type="button"
                    onClick={() => {
                      setCategoryIdFilter("All");
                      setIsCategoryOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors flex items-center justify-between ${categoryIdFilter === "All" ? "bg-slate-50 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                  >
                    <span>{t("transactions.all_categories") || "All Categories"}</span>
                    {categoryIdFilter === "All" && <Check className="w-3.5 h-3.5 text-brand-600" />}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategoryIdFilter(cat.id);
                      setIsCategoryOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors flex items-center justify-between ${String(categoryIdFilter) === String(cat.id) ? "bg-slate-50 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                  >
                    <span>{cat.name}</span>
                    {String(categoryIdFilter) === String(cat.id) && <Check className="w-3.5 h-3.5 text-brand-600" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Date Filter */}
        <div className="relative shrink-0">
          <button 
            type="button"
            onClick={() => {
              setIsDateOpen(!isDateOpen);
              setIsCategoryOpen(false);
              setIsAccountOpen(false);
            }}
            className="flex items-center justify-between gap-1.5 bg-slate-50 border border-slate-100 rounded-xl px-2 sm:px-3.5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all select-none cursor-pointer min-w-[105px] sm:min-w-[140px]"
          >
            <span>Date: {t(`transactions.${dateFilter}`) || dateFilter}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isDateOpen ? "rotate-180 text-[#00685F]" : ""}`} />
          </button>
          
          {isDateOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setIsDateOpen(false)} />
              <div className="dropdown-pop fixed mt-1.5 right-2 sm:right-auto bg-white border border-slate-100 rounded-2xl shadow-xl z-30 py-1.5 min-w-[170px] max-w-[calc(100vw-24px)] overflow-hidden">
                {['all_time', 'last_7_days', 'last_30_days', 'this_month'].map((dateOpt) => (
                  <button
                    key={dateOpt}
                    type="button"
                    onClick={() => {
                      setDateFilter(dateOpt);
                      setIsDateOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors flex items-center justify-between ${dateFilter === dateOpt ? "bg-slate-50 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                  >
                    <span>{t(`transactions.${dateOpt}`) || dateOpt}</span>
                    {dateFilter === dateOpt && <Check className="w-3.5 h-3.5 text-brand-600" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Account Filter */}
        <div className="relative shrink-0">
          <button 
            type="button"
            onClick={() => {
              setIsAccountOpen(!isAccountOpen);
              setIsCategoryOpen(false);
              setIsDateOpen(false);
            }}
            className="flex items-center justify-between gap-1.5 bg-slate-50 border border-slate-100 rounded-xl px-2 sm:px-3.5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all select-none cursor-pointer min-w-[115px] sm:min-w-[160px]"
          >
            <span className="truncate max-w-[100px]">Acc: {accountIdFilter === 'All' ? (t("transactions.acc_all") || 'All') : selectedAccount?.name}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isAccountOpen ? "rotate-180 text-[#00685F]" : ""}`} />
          </button>
          
          {isAccountOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setIsAccountOpen(false)} />
              <div className="dropdown-pop fixed mt-1.5 right-2 sm:right-auto bg-white border border-slate-100 rounded-2xl shadow-xl z-30 py-1.5 min-w-[190px] max-w-[calc(100vw-24px)] overflow-hidden max-h-56 overflow-y-auto">
                <button
                    type="button"
                    onClick={() => {
                      setAccountIdFilter("All");
                      setIsAccountOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors flex items-center justify-between ${accountIdFilter === "All" ? "bg-slate-50 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                  >
                    <span>{t("transactions.all_accounts") || "All Accounts"}</span>
                    {accountIdFilter === "All" && <Check className="w-3.5 h-3.5 text-brand-600" />}
                </button>
                {accounts.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => {
                      setAccountIdFilter(acc.id);
                      setIsAccountOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors flex items-center justify-between ${String(accountIdFilter) === String(acc.id) ? "bg-slate-50 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                  >
                    <span>{acc.name}</span>
                    {String(accountIdFilter) === String(acc.id) && <Check className="w-3.5 h-3.5 text-brand-600" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-xs w-full focus:ring-1 focus:ring-[#00685F] focus:bg-white outline-none text-slate-600 transition-all" 
            placeholder={t("transactions.search_placeholder") || "Search transactions..."}
          />
        </div>
        <button 
          onClick={handleExport}
          title="Export CSV"
          className="p-2 border border-slate-100 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all active:scale-95 hover:scale-105 cursor-pointer"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
