import { 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Sparkles, 
  Pencil, 
  Trash2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function BudgetsGrid({
  viewMode,
  monthIndex,
  currentPage,
  paginatedBudgets,
  startIndex,
  endIndex,
  budgetsLength,
  totalPages,
  setCurrentPage,
  getCategoryIcon,
  openEditModal,
  handleDelete
}) {
  return (
    <div className="space-y-6">
      {viewMode === "card" ? (
        <div 
          key={`grid-${monthIndex}-${currentPage}`}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          {paginatedBudgets.map((b, index) => {
            const percent = b.limit > 0 ? (b.spent / b.limit) : 0;
            const percentDisplay = Math.round(percent * 100);
            
            let statusText = "On track";
            let statusIcon = <CheckCircle className="w-3.5 h-3.5" />;
            let badgeBg = "bg-brand-50 text-brand-600";
            let iconBg = "bg-brand-50 text-brand-600";
            let progressBarColor = "bg-[#00685F]";
            let textColor = "text-brand-600";
            
            const isSavingsGoal = b.category.toLowerCase().includes("savings") || b.iconType === "piggy-bank";

            if (percent >= 1.0) {
              statusText = "Budget exceeded";
              statusIcon = <AlertTriangle className="w-3.5 h-3.5" />;
              badgeBg = "bg-red-50 text-red-600 animate-pulse";
              iconBg = "bg-red-50 text-red-600";
              progressBarColor = "bg-red-600";
              textColor = "text-red-600";
            } else if (percent >= 0.85) {
              statusText = "Almost reached";
              statusIcon = <AlertCircle className="w-3.5 h-3.5" />;
              badgeBg = "bg-orange-50 text-orange-600";
              iconBg = "bg-orange-50 text-orange-600";
              progressBarColor = "bg-amber-600";
              textColor = "text-orange-600";
            } else if (percent >= 0.75) {
              statusText = "Approaching limit";
              statusIcon = <AlertCircle className="w-3.5 h-3.5" />;
              badgeBg = "bg-orange-50 text-orange-600";
              iconBg = "bg-orange-50 text-orange-600";
              progressBarColor = "bg-amber-600";
              textColor = "text-orange-600";
            } else if (percent <= 0.35 && !isSavingsGoal) {
              statusText = "Low utilization";
              statusIcon = <Info className="w-3.5 h-3.5" />;
              badgeBg = "bg-slate-100 text-slate-500";
              iconBg = "bg-slate-50 text-slate-500";
              progressBarColor = "bg-slate-400";
              textColor = "text-slate-500";
            } else if (isSavingsGoal) {
              statusText = percent >= 1.0 ? "Goal reached" : "On track";
              statusIcon = <Sparkles className="w-3.5 h-3.5" />;
              badgeBg = "bg-brand-50 text-brand-700 font-extrabold";
              iconBg = "bg-[#00685F] text-white";
              progressBarColor = "bg-[#00685F]";
              textColor = "text-brand-700";
            }

            return (
              <div 
                key={b.id} 
                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between space-y-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl group relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  <button 
                    onClick={() => openEditModal(b)}
                    title="Ubah Anggaran"
                    className="p-1.5 bg-slate-50 border border-slate-100 text-slate-400 hover:text-[#00685F] hover:bg-slate-100 rounded-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(b.id)}
                    title="Hapus Anggaran"
                    className="p-1.5 bg-slate-50 border border-slate-100 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${iconBg}`}>
                    {getCategoryIcon(b.iconType)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-brand-700 transition-colors">{b.category}</h3>
                    <p className="text-xs text-gray-400">{b.description}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-400">Rp {b.spent.toLocaleString('id-ID')} / Rp {b.limit.toLocaleString('id-ID')}</span>
                    <span className={`${textColor} font-black`}>
                      {percent >= 1.0 
                        ? `Over by Rp ${(b.spent - b.limit).toLocaleString('id-ID')}` 
                        : `Rp ${(b.limit - b.spent).toLocaleString('id-ID')} left`
                      }
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden relative">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${progressBarColor}`}
                      style={{ width: `${Math.min(percentDisplay, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg px-2.5 py-1 self-start select-none ${badgeBg}`}>
                  {statusIcon}
                  <span>{statusText} ({percentDisplay}% spent)</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div 
          key={`list-${monthIndex}-${currentPage}`}
          className="space-y-3.5 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          {paginatedBudgets.map((b, index) => {
            const percent = b.limit > 0 ? (b.spent / b.limit) : 0;
            const percentDisplay = Math.round(percent * 100);
            
            let statusText = "On track";
            let statusIcon = <CheckCircle className="w-3.5 h-3.5" />;
            let badgeBg = "bg-brand-50 text-brand-600";
            let iconBg = "bg-brand-50 text-brand-600";
            let progressBarColor = "bg-[#00685F]";
            let textColor = "text-brand-600";
            
            const isSavingsGoal = b.category.toLowerCase().includes("savings") || b.iconType === "piggy-bank";

            if (percent >= 1.0) {
              statusText = "Budget exceeded";
              statusIcon = <AlertTriangle className="w-3.5 h-3.5" />;
              badgeBg = "bg-red-50 text-red-600 animate-pulse";
              iconBg = "bg-red-50 text-red-600";
              progressBarColor = "bg-red-600";
              textColor = "text-red-600";
            } else if (percent >= 0.85) {
              statusText = "Almost reached";
              statusIcon = <AlertCircle className="w-3.5 h-3.5" />;
              badgeBg = "bg-orange-50 text-orange-600";
              iconBg = "bg-orange-50 text-orange-600";
              progressBarColor = "bg-amber-600";
              textColor = "text-orange-600";
            } else if (percent >= 0.75) {
              statusText = "Approaching limit";
              statusIcon = <AlertCircle className="w-3.5 h-3.5" />;
              badgeBg = "bg-orange-50 text-orange-600";
              iconBg = "bg-orange-50 text-orange-600";
              progressBarColor = "bg-amber-600";
              textColor = "text-orange-600";
            } else if (percent <= 0.35 && !isSavingsGoal) {
              statusText = "Low utilization";
              statusIcon = <Info className="w-3.5 h-3.5" />;
              badgeBg = "bg-slate-100 text-slate-500";
              iconBg = "bg-slate-50 text-slate-500";
              progressBarColor = "bg-slate-400";
              textColor = "text-slate-500";
            } else if (isSavingsGoal) {
              statusText = percent >= 1.0 ? "Goal reached" : "On track";
              statusIcon = <Sparkles className="w-3.5 h-3.5" />;
              badgeBg = "bg-brand-50 text-brand-700 font-extrabold";
              iconBg = "bg-[#00685F] text-white";
              progressBarColor = "bg-[#00685F]";
              textColor = "text-brand-700";
            }

            return (
              <div 
                key={b.id} 
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:shadow-md hover:border-slate-200 group relative"
              >
                {/* Left: Icon & Title */}
                <div className="flex items-center gap-4 min-w-[200px] shrink-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${iconBg}`}>
                    {getCategoryIcon(b.iconType)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-700 transition-colors leading-tight">{b.category}</h4>
                    <p className="text-[11px] text-gray-400 leading-tight mt-0.5">{b.description}</p>
                  </div>
                </div>

                {/* Middle: Progress bar */}
                <div className="flex-1 min-w-[150px] md:px-4 space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-slate-400 leading-none">
                    <span>Usage Progress</span>
                    <span className={`${textColor} font-black`}>{percentDisplay}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden relative">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${progressBarColor}`}
                      style={{ width: `${Math.min(percentDisplay, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Right: Amounts & Status Badge */}
                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0">
                  <div className="text-left md:text-right">
                    <p className="text-xs font-bold text-slate-800">Rp {b.spent.toLocaleString('id-ID')} / Rp {b.limit.toLocaleString('id-ID')}</p>
                    <p className={`text-[10px] font-bold leading-tight mt-0.5 ${textColor}`}>
                      {percent >= 1.0 
                        ? `Over by Rp ${(b.spent - b.limit).toLocaleString('id-ID')}` 
                        : `Rp ${(b.limit - b.spent).toLocaleString('id-ID')} left`
                      }
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider rounded-lg px-2.5 py-1 select-none shrink-0 ${badgeBg}`}>
                      {statusIcon}
                      {statusText}
                    </span>

                    {/* Edit/Delete actions */}
                    <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
                      <button 
                        onClick={() => openEditModal(b)}
                        title="Ubah Anggaran"
                        className="p-1.5 bg-slate-50 border border-slate-100 text-slate-400 hover:text-[#00685F] hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(b.id)}
                        title="Hapus Anggaran"
                        className="p-1.5 bg-slate-50 border border-slate-100 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-4 select-none">
          <p className="text-xs font-bold text-slate-400">
            Showing <span className="text-slate-800">{startIndex + 1}</span> to{" "}
            <span className="text-slate-800">{Math.min(endIndex, budgetsLength)}</span> of{" "}
            <span className="text-slate-800">{budgetsLength}</span> budgets
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                currentPage === 1
                  ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 cursor-pointer"
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                currentPage === totalPages
                  ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 cursor-pointer"
              }`}
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
