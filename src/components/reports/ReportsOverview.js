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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all duration-500">
      {/* Left Column: Net Savings */}
      <div className="space-y-3 z-10">
        <div className="flex items-center gap-2 select-none">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Net Savings</p>
          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            Verified
          </span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#00685F] tracking-tight count-up">
          {formatRupiah(netSavings)}
        </h2>
        
        <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 pt-1 select-none">
          <span className="bg-emerald-100/80 p-1 rounded-lg">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
          </span>
          <span>+{growthPercentage}% vs previous semester</span>
        </p>
      </div>

      {/* Right Column: Saving Rate Progress & Quick Action */}
      <div className="flex items-center gap-6 sm:gap-8 z-10 mt-4 md:mt-0">
        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-end select-none">
            <div className="space-y-1">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Saving Rate</p>
              <button 
                onClick={onSimulateSavings}
                className="text-[10px] font-extrabold text-[#00685F] hover:text-[#004D46] bg-[#00685F]/5 hover:bg-[#00685F]/15 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer select-none border border-[#00685F]/10 active:scale-95"
                title="Simulasi Tambah Tabungan +Rp 500.000"
              >
                <PlusCircle className="w-3 h-3 text-[#00685F]" />
                <span>+ Rp 500rb Tabungan</span>
              </button>
            </div>
            
            <span className="text-4xl sm:text-5xl font-black text-orange-600/80 tracking-tighter leading-none">
              {savingRate}%
            </span>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200/50 p-0.5">
            <div 
              className="bg-gradient-to-r from-[#00685F] to-emerald-500 h-full rounded-full transition-all duration-1000 ease-out shadow-xs relative" 
              style={{ width: `${Math.min(savingRate, 100)}%` }}
            >
              {/* Glowing animated tip */}
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/60 rounded-full blur-[1px] animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Piggy Bank Icon Box */}
        <div 
          onClick={onSimulateSavings}
          className="w-14 h-14 sm:w-16 sm:h-16 bg-[#E6F0EF] rounded-2xl flex items-center justify-center text-[#00685F] shrink-0 shadow-inner group-hover:scale-110 group-hover:bg-[#00685F] group-hover:text-white transition-all duration-300 cursor-pointer"
          title="Klik untuk Simulasi Tabungan"
        >
          <PiggyBank className="w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-300 group-hover:rotate-12" />
        </div>
      </div>

      {/* Piggy Bank Decorative Background Overlay */}
      <PiggyBank className="absolute right-[-20px] bottom-[-20px] w-52 h-52 text-slate-100/40 -rotate-12 pointer-events-none select-none transition-all duration-700 group-hover:rotate-0 group-hover:scale-110 group-hover:text-[#00685F]/5" />
    </div>
  );
}
