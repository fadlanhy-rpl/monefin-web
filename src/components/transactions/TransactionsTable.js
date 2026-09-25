"use client";

import { useState } from "react";
import { Pencil, Trash2, Banknote, Utensils, Car, ShoppingBag, TrendingUp, HelpCircle, Receipt, SearchX } from "lucide-react";
import { formatDate } from "../../lib/utils";
import { useCurrency } from "../../hooks/useCurrency";
import { useLanguage } from "../../context/LanguageContext";
import ReceiptDetailModal from "../receipts/ReceiptDetailModal";
import TransactionsEmptyState from "./TransactionsEmptyState";

const getCategoryIcon = (iconName, colorCode) => {
  const style = colorCode ? { color: colorCode } : {};
  switch (iconName) {
    case 'utensils': return <Utensils className="w-3.5 h-3.5" style={style} />;
    case 'car': return <Car className="w-3.5 h-3.5" style={style} />;
    case 'shopping-bag': return <ShoppingBag className="w-3.5 h-3.5" style={style} />;
    case 'trending-up': return <TrendingUp className="w-3.5 h-3.5" style={style} />;
    case 'banknote': return <Banknote className="w-3.5 h-3.5" style={style} />;
    default: return <HelpCircle className="w-3.5 h-3.5" style={style} />;
  }
};

export default function TransactionsTable({
  transactions,
  openEditModal,
  handleDelete,
  handleDeleteClick,
  isVisible,
  paginationMeta,
  onPageChange,
  setPage,
  openAddModal,
  onScanReceipt,
  isFiltered = false,
  searchQuery = "",
  onResetFilter,
}) {
  const onDelete = handleDelete || handleDeleteClick || (() => {});
  const onPage = onPageChange || setPage || (() => {});
  const { t, language } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [selectedReceiptTxn, setSelectedReceiptTxn] = useState(null);
  const from = paginationMeta?.from || 0;
  const to = paginationMeta?.to || 0;
  const total = paginationMeta?.total || 0;
  const currentPage = paginationMeta?.current_page || 1;
  const lastPage = paginationMeta?.last_page || 1;

  // Pagination buttons logic
  const renderPaginationButtons = () => {
    let pages = [];
    if (lastPage <= 5) {
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, 4, '...', lastPage];
      } else if (currentPage >= lastPage - 2) {
        pages = [1, '...', lastPage - 3, lastPage - 2, lastPage - 1, lastPage];
      } else {
        pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', lastPage];
      }
    }

    return pages.map((p, idx) => {
      if (p === '...') {
        return <span key={idx} className="text-gray-300 px-1 select-none">...</span>;
      }
      return (
        <button
          key={idx}
          onClick={() => onPage(p)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer ${p === currentPage ? "bg-[#00685F] text-white shadow-md shadow-[#00685F]/20" : "text-gray-500 hover:bg-slate-100 hover:text-slate-800"}`}
        >
          {p}
        </button>
      );
    });
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className={`transition-all duration-700 delay-500 ease-out transform relative z-10 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <TransactionsEmptyState
          isFiltered={isFiltered}
          searchQuery={searchQuery}
          onResetFilter={onResetFilter}
          onAddTransaction={openAddModal}
          onScanReceipt={onScanReceipt}
        />
        {/* Receipt Detail Modal */}
        <ReceiptDetailModal
          isOpen={Boolean(selectedReceiptTxn)}
          onClose={() => setSelectedReceiptTxn(null)}
          transaction={selectedReceiptTxn}
        />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-all duration-700 delay-500 ease-out transform relative z-10 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      
      {/* Mobile Card List View (Phones & Small Screens: < md) */}
      <div className="block md:hidden divide-y divide-slate-100">
        {transactions.map((txn) => {
          const isExpense = txn.type === 'expense';
          const finalAmount = isExpense ? -Math.abs(txn.amount) : Math.abs(txn.amount);
          const amountText = formatCurrency(finalAmount);
          const amountClass = isExpense ? "text-rose-600 font-black" : "text-emerald-600 font-black";

          const categoryName = txn.category?.name || (t("transactions.unknown") || "Unknown");
          const catIcon = txn.category?.icon;
          const catColor = txn.category?.color || "#00685F";

          return (
            <div 
              key={`mobile-${txn.id}`} 
              className="p-4 hover:bg-slate-50/70 transition-colors space-y-2.5"
            >
              {/* Top Row: Category Pill + Amount */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div 
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                    style={{ backgroundColor: catColor + '18', color: catColor }}
                  >
                    {getCategoryIcon(catIcon, catColor)}
                  </div>
                  <div className="min-w-0">
                    <span 
                      className="text-xs font-bold truncate block"
                      style={{ color: catColor }}
                    >
                      {categoryName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {formatDate(txn.transaction_date)} • {txn.account?.name || "Account"}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-sm sm:text-base font-mono tracking-tight ${amountClass}`}>
                    {amountText}
                  </span>
                </div>
              </div>

              {/* Middle Row: Note / Description + Receipt Badge */}
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <p className="text-xs text-slate-600 font-medium truncate flex-1">
                  {txn.description || <span className="text-slate-300 italic">{language === "en" ? "No note" : "Tanpa catatan"}</span>}
                </p>

                {Boolean(txn.receipt_data || txn.receipt_image_path) && (
                  <button
                    type="button"
                    onClick={() => setSelectedReceiptTxn(txn)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-[#00685F] text-[10px] font-bold border border-teal-200/60 hover:bg-teal-100 transition active:scale-95 shrink-0 cursor-pointer min-h-[32px]"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>{language === "en" ? "Receipt" : "Struk"}</span>
                  </button>
                )}
              </div>

              {/* Bottom Row: Quick Action Buttons (Touch target 40-44px) */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => openEditModal(txn)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-[#00685F] hover:bg-slate-100 rounded-xl transition cursor-pointer active:scale-95 min-h-[38px]"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>{language === "en" ? "Edit" : "Ubah"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(txn.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer active:scale-95 min-h-[38px]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === "en" ? "Delete" : "Hapus"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop / Tablet Table View (Visible on screens >= md) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-slate-50/50 text-[10px] font-black uppercase text-gray-400 tracking-widest">
            <tr>
              <th className="px-6 py-5">{t("transactions.date") || "Date"}</th>
              <th className="px-6 py-5">{t("transactions.category") || "Category"}</th>
              <th className="px-6 py-5">{t("transactions.account") || "Account"}</th>
              <th className="px-6 py-5">{t("transactions.note") || "Note"}</th>
              <th className="px-6 py-5 text-right">{t("transactions.amount") || "Amount"}</th>
              <th className="px-6 py-5 text-center">{t("transactions.actions") || "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
            {transactions.length > 0 ? (
              transactions.map((txn) => {
                const isExpense = txn.type === 'expense';
                const finalAmount = isExpense ? -Math.abs(txn.amount) : Math.abs(txn.amount);
                const amountText = formatCurrency(finalAmount);
                const amountClass = isExpense ? "text-red-600 font-extrabold" : "text-emerald-600 font-extrabold";

                const categoryName = txn.category?.name || (t("transactions.unknown") || "Unknown");
                const catIcon = txn.category?.icon;
                const catColor = txn.category?.color || "#64748b";

                return (
                  <tr key={txn.id} className="txn-row border-b border-slate-100/60 hover:bg-[#f4faf9] transition-all duration-200 group">
                    <td className="px-6 py-4 text-gray-500 font-semibold whitespace-nowrap">{formatDate(txn.transaction_date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-300 hover:scale-105"
                        style={{ backgroundColor: catColor + '15', color: catColor }}
                      >
                        {getCategoryIcon(catIcon, catColor)}
                        {categoryName}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 text-xs whitespace-nowrap">{txn.account?.name || "Unknown"}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs max-w-xs font-medium">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="truncate" title={txn.description || "-"}>{txn.description || "-"}</span>
                        {Boolean(txn.receipt_data || txn.receipt_image_path) && (
                          <button
                            type="button"
                            onClick={() => setSelectedReceiptTxn(txn)}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-teal-50 text-[#00685F] text-[10px] font-bold hover:bg-teal-100 transition cursor-pointer shrink-0"
                            title={language === "en" ? "View Receipt" : "Lihat Struk Belanja"}
                          >
                            <Receipt className="w-3 h-3" />
                            <span>{language === "en" ? "Receipt" : "Struk"}</span>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap font-mono tracking-tight">
                      <span className={amountClass}>{amountText}</span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-2 text-slate-300 group-hover:text-slate-400 transition-colors">
                        <button 
                          onClick={() => openEditModal(txn)}
                          title={language === 'en' ? "Edit Transaction" : "Edit Transaksi"}
                          className="hover:text-[#00685F] transition-all p-1 hover:bg-slate-100 rounded-lg active:scale-95 hover:scale-110 duration-200 hover:rotate-6 cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onDelete(txn.id)}
                          title={language === 'en' ? "Delete Transaction" : "Hapus Transaksi"}
                          className="hover:text-red-500 transition-all p-1 hover:bg-slate-100 rounded-lg active:scale-95 hover:scale-110 duration-200 hover:-rotate-6 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center text-center max-w-sm mx-auto px-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100/90 border border-slate-200/80 text-slate-400 flex items-center justify-center mb-3.5 shadow-xs">
                      <SearchX className="w-7 h-7 text-slate-400" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 tracking-tight">
                      {t("transactions.no_transactions_found", language === "en" ? "No Transactions Found" : "Tidak Ada Transaksi Ditemukan")}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {t("transactions.no_matching", language === "en" ? "No transactions match your search / filter criteria. Try adjusting date range or category filters." : "Tidak ada transaksi yang cocok dengan kriteria pencarian / filter Anda. Coba sesuaikan rentang tanggal atau kategori.")}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer */}
      {total > 0 && (
        <div className="bg-white px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 font-semibold">
            {t("transactions.showing") || "Showing"} <span className="text-slate-700 font-bold">{from}</span> {t("transactions.to") || "to"} <span className="text-slate-700 font-bold">{to}</span> {t("transactions.of") || "of"} <span className="text-slate-700 font-bold">{total}</span> {t("transactions.results") || "results"}
          </p>
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
            <button 
              onClick={() => currentPage > 1 && onPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3.5 py-2.5 sm:px-3 sm:py-2 text-xs border border-gray-100 rounded-xl font-bold flex items-center gap-1 select-none transition-all min-h-[40px] ${currentPage === 1 ? "text-gray-300 bg-gray-50 cursor-not-allowed" : "text-slate-700 hover:bg-slate-100 active:scale-95 cursor-pointer shadow-xs"}`}
            >
              &lt; <span className="inline">{t("transactions.prev") || (language === "en" ? "Previous" : "Sebelumnya")}</span>
            </button>
            <div className="hidden sm:flex items-center gap-1">
              {renderPaginationButtons()}
            </div>
            <div className="sm:hidden text-xs font-bold text-slate-700">
              {language === "en" ? "Page" : "Halaman"} {currentPage} {t("transactions.of") || (language === "en" ? "of" : "dari")} {lastPage}
            </div>
            <button 
              onClick={() => currentPage < lastPage && onPage(currentPage + 1)}
              disabled={currentPage === lastPage}
              className={`px-3.5 py-2.5 sm:px-3 sm:py-2 text-xs border border-gray-100 rounded-xl font-bold flex items-center gap-1 select-none transition-all min-h-[40px] ${currentPage === lastPage ? "text-gray-300 bg-gray-50 cursor-not-allowed" : "text-slate-700 hover:bg-slate-100 active:scale-95 cursor-pointer shadow-xs"}`}
            >
              <span className="inline">{t("transactions.next") || (language === "en" ? "Next" : "Berikutnya")}</span> &gt;
            </button>
          </div>
        </div>
      )}

      {/* Receipt Detail Modal */}
      <ReceiptDetailModal
        isOpen={Boolean(selectedReceiptTxn)}
        onClose={() => setSelectedReceiptTxn(null)}
        transaction={selectedReceiptTxn}
      />
    </div>
  );
}
