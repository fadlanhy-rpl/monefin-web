import { TrendingUp, Sparkles } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function CategoriesStats({
  totalCategories,
  activeCategoriesCount,
  onViewReportClick,
  activeTab,
  highestCategory
}) {
  const { t, language } = useLanguage();

  // Compute dynamic analysis text based on active tab
  const getAnalysisTitle = () => {
    return activeTab === "expense" 
      ? (language === "en" ? "Weekly Expense Analysis" : "Analisis Pengeluaran Mingguan")
      : (language === "en" ? "Monthly Income Analysis" : "Analisis Pemasukan Bulanan");
  };

  const getAnalysisText = () => {
    if (!highestCategory) {
      return activeTab === "expense"
        ? (language === "en" ? "No expense data analyzed this week. Start recording your transactions!" : "Belum ada data pengeluaran yang dianalisis minggu ini. Mulailah mencatat transaksi Anda!")
        : (language === "en" ? "No income data recorded this month. Record your first income!" : "Belum ada data pemasukan yang tercatat bulan ini. Catat pemasukan pertama Anda!");
    }

    if (activeTab === "expense") {
      if (highestCategory.realization >= 90) {
        return language === "en"
          ? `Category "${highestCategory.name}" has critically reached ${highestCategory.realization}% of your limit budget. It is recommended to limit expenses for this category.`
          : `Kategori "${highestCategory.name}" telah kritis mencapai ${highestCategory.realization}% dari anggaran batas Anda. Disarankan untuk membatasi pengeluaran kategori ini.`;
      }
      if (highestCategory.realization >= 75) {
        return language === "en"
          ? `Category "${highestCategory.name}" experienced a significant increase of ${highestCategory.realization}% of your limit budget. Try reducing the budget limit.`
          : `Kategori "${highestCategory.name}" mengalami kenaikan signifikan sebesar ${highestCategory.realization}% dari anggaran batas Anda. Coba kurangi limit anggaran.`;
      }
      return language === "en"
        ? `Expense budget realization is very well controlled. The highest usage is in the "${highestCategory.name}" category at ${highestCategory.realization}%.`
        : `Realisasi anggaran pengeluaran terkendali dengan sangat baik. Penggunaan tertinggi ada pada kategori "${highestCategory.name}" sebesar ${highestCategory.realization}%.`;
    } else {
      // Income tab
      return language === "en"
        ? `Category "${highestCategory.name}" contributed the most this month with a target income realization of ${highestCategory.realization}%. Outstanding performance.`
        : `Kategori "${highestCategory.name}" memberikan kontribusi terbesar bulan ini dengan realisasi target pemasukan sebesar ${highestCategory.realization}%. Performa luar biasa.`;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
      {/* Analisis Card */}
      <div className="lg:col-span-2 bg-[#00685F] p-6 sm:p-8 rounded-[2.5rem] text-white flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div className="space-y-4 relative z-10">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-300 animate-pulse" />
            {getAnalysisTitle()}
          </h3>
          <p className="text-white/80 text-xs sm:text-sm max-w-md leading-relaxed font-semibold">
            {getAnalysisText()}
          </p>
          <button 
            onClick={onViewReportClick}
            className="w-full sm:w-auto bg-white text-[#00685F] px-8 py-3.5 rounded-xl font-bold hover:shadow-lg transition active:scale-95 cursor-pointer text-xs sm:text-sm select-none"
          >
            {language === 'en' ? "View Detailed Report" : "Lihat Laporan Detail"}
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
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest select-none">{t("categories.total_categories") || "Total Kategori"}</p>
        <h3 className="text-6xl sm:text-7xl font-black text-[#00685F] tracking-tighter mt-2">{totalCategories}</h3>
        <p className="text-xs sm:text-sm font-bold text-slate-800 mt-2">{activeCategoriesCount} {language === 'en' ? "Active Categories This Month" : "Kategori Aktif Bulan Ini"}</p>
        <div className="flex gap-1.5 mt-4 select-none">
          <div className="w-2 h-2 bg-[#00685F] rounded-full"></div>
          <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
