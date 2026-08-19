import { PlusCircle } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function AccountsHeader({
  isVisible,
  totalBalance,
  openAddModal
}) {
  const { t } = useLanguage();

  return (
    <div className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8`}>
      {/* Text Overview */}
      <div className="flex-1 w-full">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">{t("accounts.title") || "Overview Akun"}</h2>
        <p className="text-slate-500 mt-2 font-medium max-w-lg leading-relaxed text-xs sm:text-sm">
          {t("accounts.subtitle") || "Kelola semua sumber dana Anda dalam satu tempat yang aman."}
        </p>
      </div>

      {/* Card Total Saldo (Reduced padding to p-4 on mobile and adjusted font size to text-2xl sm:text-4xl to prevent wrapping of Rp balance) */}
      <div className="bg-white p-4 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center lg:items-end w-full lg:w-fit min-w-0 sm:min-w-[320px] transition-all hover:shadow-md duration-300">
        <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest text-center lg:text-right">{t("accounts.total_balance") || "Total Saldo Seluruh Akun"}</p>
        <h3 className="text-2xl sm:text-4xl font-black text-[#00685F] mt-1.5 text-center lg:text-right">Rp {totalBalance.toLocaleString("id-ID")}</h3>
        
        {/* Adjusted padding to px-4 py-2.5 and text-xs on mobile to prevent "Tambah Akun Baru" from wrapping into two lines */}
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
