import { TrendingUp, PiggyBank } from "lucide-react";

export default function ReportsOverview({
  netSavings = 4800000,
  savingRate = 60,
  growthPercentage = 12.5
}) {
  const formatRupiah = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
      {/* Left Column: Net Savings */}
      <div className="space-y-2 z-10">
        <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest select-none">Net Savings</p>
        <h2 className="text-3xl sm:text-4xl font-black text-[#00685F] tracking-tight">
          {formatRupiah(netSavings)}
        </h2>
        <p className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-1 select-none">
          <TrendingUp className="w-4 h-4 shrink-0" />
          <span>+{growthPercentage}% vs previous semester</span>
        </p>
      </div>

      {/* Right Column: Saving Rate Progress */}
      <div className="flex items-center gap-6 sm:gap-8 z-10 mt-4 md:mt-0">
        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-end select-none">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Saving Rate</p>
            <span className="text-4xl sm:text-5xl font-black text-orange-600/80 tracking-tighter">{savingRate}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/50">
            <div 
              className="bg-[#00685F] h-full rounded-full transition-all duration-1000 ease-out shadow-xs" 
              style={{ width: `${Math.min(savingRate, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Piggy Bank Icon Box */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
          <PiggyBank className="w-7 h-7 sm:w-8 sm:h-8 text-[#00685F]" />
        </div>
      </div>

      {/* Piggy Bank Decorative Background Overlay */}
      <PiggyBank className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-slate-100/50 -rotate-12 pointer-events-none select-none transition-transform duration-500 group-hover:rotate-0 group-hover:scale-110" />
    </div>
  );
}
