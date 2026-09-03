import { PlusCircle, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../hooks/useCurrency";
import { useBalancePrivacy } from "../../context/BalancePrivacyContext";

export default function AccountsHeader({
  isVisible,
  totalBalance,
  openAddModal
}) {
  const { t, language } = useLanguage();
  const { formatCurrency } = useCurrency();
  const { isBalanceHidden, toggleBalancePrivacy } = useBalancePrivacy();

  return (
    <div className={`transition-opacity duration-700 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'} flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8`}>
      {/* Text Overview */}
      <div className="flex-1 w-full">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">{t("accounts.title") || "Overview Akun"}</h2>
        <p className="text-slate-600 mt-2 font-medium max-w-lg leading-relaxed text-xs sm:text-sm">
          {t("accounts.subtitle") || "Kelola semua sumber dana Anda dalam satu tempat yang aman."}
        </p>
      </div>

      {/* Card Total Saldo */}
      <div className="bg-white p-4 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center lg:items-end w-full lg:w-fit min-w-0 sm:min-w-[320px] transition-all hover:shadow-md duration-300">
        <div className="flex items-center gap-2 text-center lg:text-right">
          <p className="text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider">{t("accounts.total_balance") || "Total Saldo Seluruh Akun"}</p>

          <button
            type="button"
            onClick={toggleBalancePrivacy}
            className="p-1 text-slate-400 hover:text-[#00685F] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title={isBalanceHidden ? (language === "en" ? "Show Balance" : "Tampilkan Saldo") : (language === "en" ? "Hide Balance" : "Sembunyikan Saldo")}
            aria-label="Toggle Total Balance Privacy"
          >
            {isBalanceHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
        
        <h3 className="text-2xl sm:text-4xl font-black text-[#00685F] mt-1.5 text-center lg:text-right font-mono sm:font-sans">
          {isBalanceHidden ? "••••••••" : formatCurrency(totalBalance)}
        </h3>
        
        <button 
          onClick={openAddModal}
          className="mt-4 sm:mt-6 w-full sm:w-auto flex items-center justify-center gap-2 bg-[#00685F] text-white px-4 py-2.5 sm:px-8 sm:py-3.5 rounded-xl sm:rounded-2xl font-bold hover:bg-[#004D46] hover:shadow-lg transition shadow-lg shadow-[#00685F]/20 group active:scale-95 cursor-pointer text-xs sm:text-sm whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4 sm:w-5 h-5 shrink-0" /> {t("accounts.add_account") || "Tambah Akun Baru"}
        </button>
      </div>
    </div>
  );
}
