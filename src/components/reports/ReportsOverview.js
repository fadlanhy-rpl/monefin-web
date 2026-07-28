import { TrendingUp, PiggyBank, PlusCircle, ShieldCheck } from "lucide-react";

export default function ReportsOverview({
  netSavings = 4800000,
  savingRate = 60,
  growthPercentage = 12.5,
  onSimulateSavings
}) {
  const formatRupiah = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-white p-5 sm:p-7 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm relative z-10 overflow-hidden group hover:shadow-md transition-all duration-300">
      
      {/* Left Column: Net Savings */}
      <div className="space-y-2 z-10">
        <div className="flex items-center gap-2 select-none">
          <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">Net Savings</p>
          <span className="bg-emerald-50 text-emerald-700 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            Verified
          </span>
        </div>
        
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#00685F] tracking-tight count-up">
          {formatRupiah(netSavings)}
        </h2>
        
        <p className="text-[11px] sm:text-xs font-bold text-emerald-600 flex items-center gap-1.5 pt-0.5 select-none">
          <span className="bg-emerald-100/80 p-1 rounded-lg">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
          </span>
          <span>+{growthPercentage}% vs previous semester</span>
        </p>
      </div>

      {/* Right Column: Saving Rate Progress & Quick Action */}
      <div className="flex items-center justify-between gap-3 sm:gap-6 z-10 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
        <div className="flex-1 min-w-0 space-y-2.5">
          
          <div className="flex items-end justify-between gap-2 select-none flex-wrap">
            <div className="space-y-1">
              <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">Saving Rate</p>
              <button 
                onClick={onSimulateSavings}
                className="text-[9px] sm:text-[10px] font-extrabold text-[#00685F] hover:text-[#004D46] bg-[#00685F]/5 hover:bg-[#00685F]/15 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer select-none border border-[#00685F]/10 active:scale-95 whitespace-nowrap"
                title="Simulasi Tambah Tabungan +Rp 500.000"
              >
                <PlusCircle className="w-3 h-3 text-[#00685F] shrink-0" />
                <span>+ Rp 500rb Tabungan</span>
              </button>
            </div>
            
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-orange-600/80 tracking-tighter leading-none shrink-0">
              {savingRate}%
            </span>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full bg-slate-100 h-2.5 sm:h-3 rounded-full overflow-hidden border border-slate-200/50 p-0.5">
            <div 
              className="bg-gradient-to-r from-[#00685F] to-emerald-500 h-full rounded-full transition-all duration-1000 ease-out shadow-xs relative" 
              style={{ width: `${Math.min(savingRate, 100)}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/60 rounded-full blur-[1px] animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Piggy Bank Icon Box */}
        <div 
          onClick={onSimulateSavings}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-[#E6F0EF] rounded-2xl flex items-center justify-center text-[#00685F] shrink-0 shadow-inner group-hover:scale-105 group-hover:bg-[#00685F] group-hover:text-white transition-all duration-300 cursor-pointer"
          title="Klik untuk Simulasi Tabungan"
        >
          <PiggyBank className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 group-hover:rotate-12" />
        </div>
      </div>

      {/* Decorative Overlay Icon */}
      <PiggyBank className="absolute right-[-20px] bottom-[-20px] w-40 h-40 sm:w-48 sm:h-48 text-slate-100/30 -rotate-12 pointer-events-none select-none hidden sm:block" />
    </div>
  );
}
