import { Pencil, Trash2, Banknote, Utensils, Car, ShoppingBag, TrendingUp, HelpCircle } from "lucide-react";
import { formatDate } from "../../lib/utils";

// Formatter Helpers
function formatRupiah(n) {
  const abs = Math.abs(n).toLocaleString('id-ID');
  return (n < 0 ? '- ' : '+ ') + 'Rp ' + abs;
}

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
  isVisible,
  paginationMeta,
  onPageChange
}) {
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
          onClick={() => onPageChange(p)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer ${p === currentPage ? "bg-[#00685F] text-white shadow-md shadow-[#00685F]/20" : "text-gray-500 hover:bg-slate-100 hover:text-slate-800"}`}
        >
          {p}
        </button>
      );
    });
  };

  return (
    <div className={`bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-all duration-700 delay-500 ease-out transform relative z-10 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-slate-50/50 text-[10px] font-black uppercase text-gray-400 tracking-widest">
            <tr>
              <th className="px-6 py-5">Date</th>
              <th className="px-6 py-5">Category</th>
              <th className="px-6 py-5">Account</th>
              <th className="px-6 py-5">Note</th>
              <th className="px-6 py-5 text-right">Amount</th>
              <th className="px-6 py-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
            {transactions.length > 0 ? (
              transactions.map((t) => {
                const isExpense = t.type === 'expense';
                const finalAmount = isExpense ? -Math.abs(t.amount) : Math.abs(t.amount);
                const amountText = formatRupiah(finalAmount);
                const amountClass = isExpense ? "text-red-600 font-extrabold" : "text-emerald-600 font-extrabold";

                const categoryName = t.category?.name || "Unknown";
                const catIcon = t.category?.icon;
                const catColor = t.category?.color || "#64748b";

                return (
                  <tr key={t.id} className="txn-row border-b border-slate-100/60 hover:bg-[#f4faf9] transition-all duration-200 group">
                    <td className="px-6 py-4 text-gray-500 font-semibold whitespace-nowrap">{formatDate(t.transaction_date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-300 hover:scale-105"
                        style={{ backgroundColor: catColor + '15', color: catColor }}
                      >
                        {getCategoryIcon(catIcon, catColor)}
                        {categoryName}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 text-xs whitespace-nowrap">{t.account?.name || "Unknown"}</td>
                    <td className="px-6 py-4 text-gray-400 text-xs max-w-xs truncate font-medium" title={t.description || "-"}>
                      {t.description || "-"}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap font-mono tracking-tight">
                      <span className={amountClass}>{amountText}</span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-2 text-slate-300 group-hover:text-slate-400 transition-colors">
                        <button 
                          onClick={() => openEditModal(t)}
                          title="Edit Transaksi"
                          className="hover:text-[#00685F] transition-all p-1 hover:bg-slate-100 rounded-lg active:scale-95 hover:scale-110 duration-200 hover:rotate-6 cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(t.id)}
                          title="Hapus Transaksi"
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
                <td colSpan="6" className="py-14 text-center text-sm font-bold text-slate-400">
                  Tidak ada transaksi yang cocok dengan pencarian / filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {total > 0 && (
        <div className="px-4 py-4 sm:px-6 sm:py-5 bg-white border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
          <p className="text-xs text-gray-500 font-semibold text-center sm:text-left">
            Showing <span className="text-slate-900 font-extrabold">{from}-{to}</span> of <span className="text-slate-900 font-extrabold">{total}</span> transactions
          </p>
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
            <button 
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 text-xs border border-gray-100 rounded-xl font-bold flex items-center gap-1 select-none transition-all ${currentPage === 1 ? "text-gray-300 bg-gray-50 cursor-not-allowed" : "text-slate-700 hover:bg-slate-100 cursor-pointer"}`}
            >
              &lt; <span className="hidden sm:inline">Previous</span>
            </button>
            <div className="hidden sm:flex items-center gap-1">
              {renderPaginationButtons()}
            </div>
            <div className="sm:hidden text-xs font-bold text-slate-700">
              Page {currentPage} of {lastPage}
            </div>
            <button 
              onClick={() => currentPage < lastPage && onPageChange(currentPage + 1)}
              disabled={currentPage === lastPage}
              className={`px-3 py-2 text-xs border border-gray-100 rounded-xl font-bold flex items-center gap-1 select-none transition-all ${currentPage === lastPage ? "text-gray-300 bg-gray-50 cursor-not-allowed" : "text-slate-700 hover:bg-slate-100 cursor-pointer"}`}
            >
              <span className="hidden sm:inline">Next</span> &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
