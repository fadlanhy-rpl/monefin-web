"use client";

import { 
  Receipt, 
  ShoppingBag, 
  TrendingUp, 
  Camera, 
  Plus, 
  Search, 
  RotateCcw,
  ArrowRight
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function TransactionsEmptyState({
  isFiltered = false,
  searchQuery = "",
  onResetFilter,
  onAddTransaction,
  onScanReceipt,
}) {
  const { t, language } = useLanguage();
  const isEn = language === "en";

  if (isFiltered) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center shadow-xs animate-in fade-in duration-300">
        <div className="w-14 h-14 rounded-2xl bg-slate-100/90 border border-slate-200/80 text-slate-400 mx-auto flex items-center justify-center mb-3.5 shadow-2xs">
          <Search className="w-7 h-7 text-slate-400" />
        </div>
        <h3 className="text-base font-bold text-slate-800 tracking-tight">
          {t("transactions.no_match_title") || (isEn ? "No Matching Transactions Found" : "Tidak Ada Transaksi yang Cocok")}
        </h3>
        <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
          {searchQuery
            ? (isEn
                ? `No transactions matched "${searchQuery}". Try searching with a different note, category, or account.`
                : `Tidak ditemukan transaksi yang cocok dengan "${searchQuery}". Coba kata kunci keterangan atau kategori lain.`)
            : (t("transactions.no_match_desc") || (isEn
                ? "No transactions match your active search or filter criteria. Try adjusting date range or categories."
                : "Tidak ditemukan transaksi yang cocok dengan filter yang Anda pilih. Coba sesuaikan rentang tanggal atau kategori."))
          }
        </p>
        {onResetFilter && (
          <button
            type="button"
            onClick={onResetFilter}
            className="mt-5 inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer active:scale-95 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t("transactions.reset_filters") || (isEn ? "Show All Transactions" : "Tampilkan Semua Transaksi")}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-10 md:p-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
      <div className="w-16 h-16 rounded-3xl bg-[#00685F]/10 flex items-center justify-center text-[#00685F] mb-4 shadow-2xs">
        <Receipt className="w-8 h-8" />
      </div>

      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
        {t("transactions.empty_title") || (isEn ? "No Transactions Recorded Yet" : "Belum Ada Transaksi Keuangan")}
      </h3>

      <p className="text-slate-500 mt-1.5 max-w-md text-xs sm:text-sm leading-relaxed font-medium">
        {t("transactions.empty_desc") || (isEn
          ? "You haven't recorded any income or expenses yet. Start tracking your daily cashflow or scan your shopping receipts with AI to gain total clarity over your finances."
          : "Anda belum mencatat pemasukan atau pengeluaran apa pun. Mulai catat transaksi harian Anda atau gunakan pemindai struk instan berbasis AI untuk memantau arus kas secara teratur.")}
      </p>

      {/* Starter Quick Actions */}
      <div className="mt-8 w-full max-w-2xl text-left">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-3 text-center">
          {t("transactions.starter_title") || (isEn ? "Choose how to start your first record:" : "Pilih cara untuk memulai catatan pertama:")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Action 1: Expense */}
          <button
            type="button"
            onClick={() => onAddTransaction && onAddTransaction("expense")}
            className="p-4 rounded-2xl border border-slate-200/80 hover:border-rose-400 hover:bg-rose-50/20 transition text-left cursor-pointer group active:scale-98 shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div className="font-bold text-slate-900 text-sm group-hover:text-rose-600 transition-colors">
              {t("transactions.starter_expense_title") || (isEn ? "Record Expense" : "Catat Pengeluaran")}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 font-medium leading-snug">
              {t("transactions.starter_expense_desc") || (isEn ? "Daily meals, groceries, transport, or bills" : "Makan harian, belanja, transport, atau tagihan")}
            </div>
            <div className="text-[11px] text-rose-600 mt-2 font-bold flex items-center gap-1">
              <span>{isEn ? "Add expense" : "Tambah pengeluaran"}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Action 2: Income */}
          <button
            type="button"
            onClick={() => onAddTransaction && onAddTransaction("income")}
            className="p-4 rounded-2xl border border-slate-200/80 hover:border-emerald-500 hover:bg-emerald-50/20 transition text-left cursor-pointer group active:scale-98 shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
              {t("transactions.starter_income_title") || (isEn ? "Record Income" : "Catat Pemasukan")}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 font-medium leading-snug">
              {t("transactions.starter_income_desc") || (isEn ? "Monthly salary, incoming transfers, or freelance" : "Gaji bulanan, transfer masuk, atau freelance")}
            </div>
            <div className="text-[11px] text-emerald-600 mt-2 font-bold flex items-center gap-1">
              <span>{isEn ? "Add income" : "Tambah pemasukan"}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Action 3: Scan Receipt */}
          <button
            type="button"
            onClick={() => onScanReceipt && onScanReceipt()}
            className="p-4 rounded-2xl border border-slate-200/80 hover:border-[#00685F] hover:bg-[#00685F]/5 transition text-left cursor-pointer group active:scale-98 shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#00685F] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Camera className="w-4 h-4" />
            </div>
            <div className="font-bold text-slate-900 text-sm group-hover:text-[#00685F] transition-colors">
              {t("transactions.starter_scan_title") || (isEn ? "Scan Receipt" : "Pindai Struk Belanja")}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 font-medium leading-snug">
              {t("transactions.starter_scan_desc") || (isEn ? "Snap physical receipts into transactions via AI" : "Foto bon belanjaan fisik langsung jadi transaksi via AI")}
            </div>
            <div className="text-[11px] text-[#00685F] mt-2 font-bold flex items-center gap-1">
              <span>{isEn ? "Scan receipt" : "Buka scanner"}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={() => onAddTransaction && onAddTransaction()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#00685F] hover:bg-[#004D46] text-white font-bold rounded-2xl shadow-md shadow-[#00685F]/20 transition-all active:scale-95 text-xs sm:text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t("transactions.add_btn") || (isEn ? "Add Transaction" : "Tambah Transaksi")}</span>
        </button>

        {onScanReceipt && (
          <button
            type="button"
            onClick={onScanReceipt}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-teal-50 hover:bg-teal-100 text-[#00685F] border border-teal-200/80 font-bold rounded-2xl transition-all active:scale-95 text-xs sm:text-sm cursor-pointer shadow-2xs"
          >
            <Camera className="w-4 h-4 text-[#00685F]" />
            <span>{t("transactions.scan_receipt") || (isEn ? "Scan Receipt" : "Pindai Struk")}</span>
          </button>
        )}
      </div>
    </div>
  );
}
