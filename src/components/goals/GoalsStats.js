import { TrendingUp, Sparkles } from "lucide-react";

export default function GoalsStats({
  savingRate,
  savingRateIncrease
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LAJU MENABUNG */}
      <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow">
        <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
          <TrendingUp className="w-8 h-8" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900 leading-tight">Laju Menabung</p>
          <p className="text-[10px] font-bold text-gray-400 mt-0.5 select-none">Rata-rata 30 hari terakhir</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <h4 className="text-2xl font-black text-slate-900 tracking-tight">Rp {savingRate.toLocaleString("id-ID")}</h4>
            <span className="text-emerald-500 font-black text-xs shrink-0">↑ {savingRateIncrease}%</span>
          </div>
          {/* Static design representation as requested */}
          <div className="w-full max-w-[120px] bg-slate-50 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-orange-400 h-full w-[40%]"></div>
          </div>
        </div>
      </div>

      {/* TIPS CERDAS */}
      <div className="lg:col-span-2 bg-[#00685F] p-6 sm:p-8 rounded-[2rem] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div className="space-y-2 relative z-10">
          <h4 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-300 animate-pulse" />
            Tips Cerdas MoneFin
          </h4>
          <p className="text-xs sm:text-sm text-white/70 max-w-md font-medium leading-relaxed">
            Aktifkan fitur Auto-Debet ke kantong 'Dana Darurat' setiap tanggal gajian untuk mempercepat target Anda hingga 3 bulan lebih awal.
          </p>
        </div>
        <button className="relative z-10 w-full sm:w-auto bg-white text-[#00685F] px-8 py-3.5 rounded-2xl font-black text-xs sm:text-sm hover:shadow-xl hover:bg-slate-50 transition active:scale-95 cursor-pointer shrink-0">
          Aktifkan Sekarang
        </button>
        {/* Decor circle */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
      </div>
    </div>
  );
}
