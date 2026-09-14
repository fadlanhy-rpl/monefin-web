"use client";

import { 
  RefreshCcw, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft 
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function RecurringEmptyState({
  isFiltered = false,
  onResetFilters,
  onAddSchedule,
  onApplyStarter,
}) {
  const { t, language } = useLanguage();
  const isEn = language === "en";

  if (isFiltered) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <Search className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">
          {isEn ? "No matching schedules found" : "Tidak ada jadwal yang cocok"}
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
          {isEn ? "Try adjusting your search query or filters." : "Coba sesuaikan kata kunci pencarian atau filter Anda."}
        </p>
        <button
          onClick={onResetFilters}
          className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition cursor-pointer"
        >
          {isEn ? "Reset Filters" : "Reset Filter"}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 sm:p-12 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-3xl bg-[#00685F]/10 flex items-center justify-center text-[#00685F] mb-4">
        <RefreshCcw className="w-8 h-8" />
      </div>
      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
        {t("recurring.empty_title") || (isEn ? "No Recurring Transactions Yet" : "Belum Ada Jadwal Transaksi Rutin")}
      </h3>
      <p className="text-slate-500 mt-1 max-w-md text-xs sm:text-sm leading-relaxed">
        {t("recurring.empty_desc") || (isEn
          ? "Set up recurring schedules so MoneFin automatically records recurring income and expenses without manual entry every time."
          : "Pasang jadwal rutin agar sistem MoneFin mencatat pengeluaran dan pemasukan otomatis tanpa perlu input manual setiap kali.")}
      </p>

      {/* Starter Templates */}
      <div className="mt-8 w-full max-w-2xl text-left">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">
          {isEn ? "Or start quickly with these popular templates:" : "Atau mulai cepat dengan template populer:"}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Starter 1: Salary */}
          <button
            onClick={() => onApplyStarter({
              title: isEn ? "Monthly Salary" : "Gaji Pokok",
              type: "income",
              amount: 5000000,
              period_type: "monthly",
            })}
            className="p-4 rounded-2xl border border-slate-200/80 hover:border-[#00685F] hover:bg-[#00685F]/5 transition text-left cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div className="font-bold text-slate-900 text-sm group-hover:text-[#00685F] transition">
              {t("recurring.starter_salary_title") || (isEn ? "Monthly Salary" : "Gaji Bulanan")}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {t("recurring.starter_salary_desc") || (isEn ? "Fixed monthly payday income" : "Pemasukan gajian tetap")}
            </div>
          </button>

          {/* Starter 2: Bills */}
          <button
            onClick={() => onApplyStarter({
              title: isEn ? "Internet & Streaming" : "WiFi & Langganan",
              type: "expense",
              amount: 350000,
              period_type: "monthly",
            })}
            className="p-4 rounded-2xl border border-slate-200/80 hover:border-[#00685F] hover:bg-[#00685F]/5 transition text-left cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2.5">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <div className="font-bold text-slate-900 text-sm group-hover:text-[#00685F] transition">
              {t("recurring.starter_bills_title") || (isEn ? "Bills & Subscriptions" : "Tagihan & Langganan")}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {t("recurring.starter_bills_desc") || (isEn ? "WiFi, Netflix, Gym" : "WiFi, listrik, atau gym")}
            </div>
          </button>

          {/* Starter 3: Daily Ops */}
          <button
            onClick={() => onApplyStarter({
              title: isEn ? "Daily Food Allowance" : "Makan & Transport",
              type: "expense",
              amount: 50000,
              period_type: "daily",
            })}
            className="p-4 rounded-2xl border border-slate-200/80 hover:border-[#00685F] hover:bg-[#00685F]/5 transition text-left cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-2.5">
              <RefreshCcw className="w-4 h-4" />
            </div>
            <div className="font-bold text-slate-900 text-sm group-hover:text-[#00685F] transition">
              {t("recurring.starter_daily_title") || (isEn ? "Daily Operations" : "Operasional Harian")}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {t("recurring.starter_daily_desc") || (isEn ? "Daily food / commute" : "Alokasi makan harian")}
            </div>
          </button>

        </div>
      </div>

      <button
        onClick={onAddSchedule}
        className="mt-8 px-6 py-3 bg-[#00685F] text-white font-bold rounded-2xl hover:bg-[#004D46] shadow-sm transition active:scale-95 text-sm cursor-pointer"
      >
        {t("recurring.add_button") || (isEn ? "Add Recurring Schedule" : "Tambah Jadwal Rutin")}
      </button>
    </div>
  );
}
