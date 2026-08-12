import { TrendingUp, TrendingDown, PiggyBank, ShieldCheck, ArrowUpRight, ArrowDownRight } from "lucide-react";

const fmt = (val) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val);

function StatCard({ title, value, sub, badge, icon: Icon, iconBg, iconColor, trend, loading }) {
  if (loading) {
    return (
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm animate-pulse">
        <div className="h-3 bg-slate-100 rounded w-1/3 mb-3"></div>
        <div className="h-8 bg-slate-100 rounded w-2/3 mb-2"></div>
        <div className="h-2.5 bg-slate-100 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest select-none">{title}</p>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-1.5 truncate">{value}</h3>
          {sub && <p className="text-[11px] font-semibold text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-2xl ${iconBg} flex items-center justify-center ${iconColor} shrink-0 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {badge && (
        <div className="mt-3 flex items-center gap-1.5">
          {trend === "up" && <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />}
          {trend === "down" && <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />}
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${badge}`}>{sub}</span>
        </div>
      )}
    </div>
  );
}

export default function ReportsOverview({
  totalIncome  = 0,
  totalExpense = 0,
  netSavings   = 0,
  savingRate   = 0,
  loading      = false,
}) {
  const isDeficit = netSavings < 0;
  const rateGood  = savingRate >= 20;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Net Savings */}
      <div className={`bg-gradient-to-br ${isDeficit ? "from-red-600 to-rose-700" : "from-[#00685F] to-[#004D46]"} text-white p-5 rounded-2xl shadow-lg ${isDeficit ? "shadow-red-500/20" : "shadow-[#00685F]/20"} relative overflow-hidden group col-span-2 lg:col-span-1`}>
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-3 bg-white/30 rounded w-1/2"></div>
            <div className="h-8 bg-white/30 rounded w-3/4"></div>
            <div className="h-2.5 bg-white/30 rounded w-1/3"></div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 select-none">
              <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">Net Savings</p>
              <span className="bg-white/20 text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> {isDeficit ? "Defisit" : "Surplus"}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-2">
              {fmt(Math.abs(netSavings))}
            </h2>
            <p className="text-[11px] font-semibold text-white/70 mt-1 flex items-center gap-1">
              {isDeficit
                ? <><TrendingDown className="w-3.5 h-3.5" /> Pengeluaran melebihi pemasukan</>
                : <><TrendingUp className="w-3.5 h-3.5" /> Keuangan dalam kondisi sehat</>}
            </p>
          </>
        )}
      </div>

      {/* Saving Rate */}
      {loading ? (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm animate-pulse">
          <div className="h-3 bg-slate-100 rounded w-1/3 mb-3"></div>
          <div className="h-8 bg-slate-100 rounded w-1/2 mb-3"></div>
          <div className="h-3 bg-slate-100 rounded w-full"></div>
        </div>
      ) : (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest select-none">Saving Rate</p>
          <div className="flex items-end gap-2 mt-1.5">
            <h3 className={`text-2xl sm:text-3xl font-black tracking-tighter ${rateGood ? "text-[#00685F]" : "text-orange-500"}`}>
              {savingRate}%
            </h3>
            <span className={`text-[10px] font-black mb-1.5 px-2 py-0.5 rounded-lg border ${rateGood ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-orange-50 text-orange-600 border-orange-100"}`}>
              {rateGood ? "Baik ✓" : "Perlu Ditingkatkan"}
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/50">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${rateGood ? "bg-gradient-to-r from-[#00685F] to-emerald-500" : "bg-gradient-to-r from-orange-400 to-amber-500"}`}
              style={{ width: `${Math.min(savingRate, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 font-semibold mt-1.5 select-none">Target: ≥ 20%</p>
        </div>
      )}

      {/* Total Income */}
      <StatCard
        title="Total Pemasukan"
        value={fmt(totalIncome)}
        icon={TrendingUp}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
        loading={loading}
      />

      {/* Total Expense */}
      <StatCard
        title="Total Pengeluaran"
        value={fmt(totalExpense)}
        icon={TrendingDown}
        iconBg="bg-red-50"
        iconColor="text-red-500"
        loading={loading}
      />
    </div>
  );
}
