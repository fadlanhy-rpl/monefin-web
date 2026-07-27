import { TrendingUp } from "lucide-react";

export default function CategoriesStats({
  totalCategories,
  activeCategoriesCount,
  onViewReportClick
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
      {/* Analisis Card */}
      <div className="lg:col-span-2 bg-[#00685F] p-6 sm:p-8 rounded-[2.5rem] text-white flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div className="space-y-4 relative z-10">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Analisis Pengeluaran Mingguan</h3>
          <p className="text-white/80 text-xs sm:text-sm max-w-md leading-relaxed font-semibold">
            Kategori "Makanan & Minuman" mengalami kenaikan 12% dibandingkan minggu lalu. Coba atur limit anggaran untuk menghemat lebih banyak.
          </p>
          <button 
            onClick={onViewReportClick}
            className="w-full sm:w-auto bg-white text-[#00685F] px-8 py-3.5 rounded-xl font-bold hover:shadow-lg transition active:scale-95 cursor-pointer text-xs sm:text-sm select-none"
          >
            Lihat Laporan Detail
          </button>
        </div>
        <div className="relative z-10 opacity-30 group-hover:scale-105 transition-transform duration-500 shrink-0">
          <TrendingUp className="w-28 h-28 sm:w-36 sm:h-36" />
        </div>
        {/* Decoration background */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl select-none"></div>
      </div>

      {/* Total Kategori Card */}
      <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-between text-center min-h-[220px] hover:shadow-md transition-shadow">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest select-none">Total Kategori</p>
        <h3 className="text-6xl sm:text-7xl font-black text-[#00685F] tracking-tighter mt-2">{totalCategories}</h3>
        <p className="text-xs sm:text-sm font-bold text-slate-800 mt-2">{activeCategoriesCount} Kategori Aktif Bulan Ini</p>
        <div className="flex gap-1.5 mt-4 select-none">
          <div className="w-2 h-2 bg-[#00685F] rounded-full"></div>
          <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
