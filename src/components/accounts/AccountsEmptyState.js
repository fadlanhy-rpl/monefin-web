"use client";

import { 
  Landmark, 
  Smartphone, 
  Banknote, 
  Plus, 
  Search, 
  RotateCcw,
  WalletCards
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function AccountsEmptyState({
  isFiltered = false,
  searchQuery = "",
  onResetSearch,
  onAddAccount,
}) {
  const { t, language } = useLanguage();
  const isEn = language === "en";

  if (isFiltered) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center shadow-xs animate-in fade-in duration-300">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <Search className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">
          {t("accounts.no_match_title") || (isEn ? "No matching accounts found" : "Tidak ada rekening yang cocok")}
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
          {isEn
            ? `No accounts matched "${searchQuery}". Try searching with a different account name or number.`
            : `Tidak ditemukan rekening yang cocok dengan "${searchQuery}". Coba kata kunci atau nama akun lain.`}
        </p>
        <button
          type="button"
          onClick={onResetSearch}
          className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isEn ? "Show All Accounts" : "Tampilkan Semua Rekening"}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-10 md:p-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
      <div className="w-16 h-16 rounded-3xl bg-[#00685F]/10 flex items-center justify-center text-[#00685F] mb-4 shadow-2xs">
        <WalletCards className="w-8 h-8" />
      </div>

      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
        {t("accounts.empty_title") || (isEn ? "No Financial Accounts Yet" : "Belum Ada Akun Keuangan")}
      </h3>

      <p className="text-slate-500 mt-1.5 max-w-md text-xs sm:text-sm leading-relaxed font-medium">
        {t("accounts.empty_desc") || (isEn
          ? "You haven't added any bank accounts, e-wallets, or cash reserves yet. Connect your funding sources to start tracking your total balance and cash flow."
          : "Anda belum menambahkan rekening bank, dompet digital, atau uang tunai. Tambahkan akun Anda untuk mulai memantau total saldo dan arus kas secara terpusat.")}
      </p>

      {/* Starter Template Cards */}
      <div className="mt-8 w-full max-w-2xl text-left">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-3 text-center">
          {t("accounts.starter_title") || (isEn ? "Choose an account type to start:" : "Pilih tipe akun untuk memulai cepat:")}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Bank Starter */}
          <button
            type="button"
            onClick={() => onAddAccount && onAddAccount("bank")}
            className="p-4 rounded-2xl border border-slate-200/80 hover:border-[#00685F] hover:bg-[#00685F]/5 transition text-left cursor-pointer group active:scale-98"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Landmark className="w-4 h-4" />
            </div>
            <div className="font-bold text-slate-900 text-sm group-hover:text-[#00685F] transition-colors">
              {t("accounts.starter_bank_title") || (isEn ? "Bank Account" : "Rekening Bank")}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
              {t("accounts.starter_bank_desc") || (isEn ? "BCA, Mandiri, BRI, BNI" : "BCA, Mandiri, BRI, BNI, dll.")}
            </div>
          </button>

          {/* E-Wallet Starter */}
          <button
            type="button"
            onClick={() => onAddAccount && onAddAccount("ewallet")}
            className="p-4 rounded-2xl border border-slate-200/80 hover:border-[#00685F] hover:bg-[#00685F]/5 transition text-left cursor-pointer group active:scale-98"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#00685F] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="font-bold text-slate-900 text-sm group-hover:text-[#00685F] transition-colors">
              {t("accounts.starter_ewallet_title") || (isEn ? "Digital Wallet" : "Dompet Digital")}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
              {t("accounts.starter_ewallet_desc") || (isEn ? "GoPay, OVO, Dana, ShopeePay" : "GoPay, OVO, Dana, ShopeePay")}
            </div>
          </button>

          {/* Cash Starter */}
          <button
            type="button"
            onClick={() => onAddAccount && onAddAccount("cash")}
            className="p-4 rounded-2xl border border-slate-200/80 hover:border-[#00685F] hover:bg-[#00685F]/5 transition text-left cursor-pointer group active:scale-98"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Banknote className="w-4 h-4" />
            </div>
            <div className="font-bold text-slate-900 text-sm group-hover:text-[#00685F] transition-colors">
              {t("accounts.starter_cash_title") || (isEn ? "Cash in Hand" : "Uang Tunai (Cash)")}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
              {t("accounts.starter_cash_desc") || (isEn ? "Physical wallet, petty cash" : "Dompet fisik, uang darurat")}
            </div>
          </button>

        </div>
      </div>

      <button
        type="button"
        onClick={() => onAddAccount && onAddAccount("bank")}
        className="mt-7 inline-flex items-center gap-2 px-6 py-3.5 bg-[#00685F] hover:bg-[#004D46] text-white font-bold rounded-2xl shadow-md shadow-[#00685F]/20 transition-all active:scale-95 text-xs sm:text-sm cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>{t("accounts.add_account") || (isEn ? "Add New Account" : "Tambah Akun Baru")}</span>
      </button>
    </div>
  );
}
