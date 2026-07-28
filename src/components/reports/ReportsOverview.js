import { TrendingUp, PiggyBank } from "lucide-react";

export default function ReportsOverview({
  netSavings = "Rp 4.800.000",
  growthPercentage = "+12.5%",
  savingRate = 60
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
      {/* Net Savings Section */}
      <div className="space-y-1 z-10">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Savings</p>
        <h3 className="text-3xl sm:text-4xl font-black text-[#00685F] tracking-tight">{netSavings}</h3>
        <p className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-1">
          <TrendingUp className="w-4 h-4" /> {growthPercentage} vs previous semester
        </p>
      </div>

      {/* Saving Rate Section */}
      <div className="flex items-center gap-6 sm:gap-8 z-10">
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-end">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saving Rate</p>
            <span className="text-4xl sm:text-5xl font-black text-orange-600/80 tracking-tighter">{savingRate}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#00685F] h-full transition-all duration-1000 ease-out" 
              style={{ width: `${Math.min(savingRate, 100)}%` }}
            ></div>
          </div>
        </div>
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shrink-0 shadow-inner">
          <PiggyBank className="w-7 h-7 sm:w-8 sm:h-8 text-slate-500" />
        </div>
      </div>

      {/* Decorative Background Icon */}
      <PiggyBank className="absolute right-[-20px] bottom-[-20px] w-40 h-40 sm:w-48 sm:h-48 text-slate-100/60 -rotate-12 pointer-events-none select-none" />
    </div>
  );
}
