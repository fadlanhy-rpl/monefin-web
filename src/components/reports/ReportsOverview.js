"use client";

import { TrendingUp, TrendingDown, Target, Activity, AlertTriangle, CheckCircle, Info, Zap } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../hooks/useCurrency";

function HealthGauge({ rate, language }) {
  const pct = Math.min(Math.max(rate, 0), 100);
  const r = 38, cx = 50, cy = 52;
  const circ = Math.PI * r;
  const dashOffset = circ - (pct / 100) * circ;
  const color = pct >= 30 ? "#00685F" : pct >= 20 ? "#10b981" : pct >= 10 ? "#f59e0b" : "#ef4444";
  const label = language === 'en' 
    ? (pct >= 30 ? "Very Healthy" : pct >= 20 ? "Healthy" : pct >= 10 ? "Fair" : "Needs Attention")
    : (pct >= 30 ? "Sangat Sehat" : pct >= 20 ? "Sehat" : pct >= 10 ? "Cukup" : "Perlu Perhatian");
  const textColor = pct >= 30 ? "text-[#00685F]" : pct >= 20 ? "text-emerald-600" : pct >= 10 ? "text-amber-500" : "text-red-500";
  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 100 58" className="w-28 h-16">
        <path d="M 12 52 A 38 38 0 0 1 88 52" fill="none" stroke="#f1f5f9" strokeWidth="10" strokeLinecap="round" />
        <path
          d="M 12 52 A 38 38 0 0 1 88 52"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 1s ease-out, stroke 0.5s" }}
        />
        <circle
          cx={cx + r * Math.cos(Math.PI - (pct / 100) * Math.PI)}
          cy={cy - r * Math.sin((pct / 100) * Math.PI)}
          r="4"
          fill={color}
          stroke="white"
          strokeWidth="2"
        />
      </svg>
      <span className={`text-[10px] font-black uppercase tracking-wider ${textColor}`}>{label}</span>
    </div>
  );
}

function MiniBar({ pct, color }) {
  return (
    <div className="flex items-end h-5 gap-[1px] mt-1">
      {[20, 40, 60, 80, 100].map((step, i) => (
        <div
          key={i}
          className="w-1.5 rounded-sm transition-all duration-700"
          style={{ height: `${(step / 100) * 20}px`, background: pct >= step ? color : "#e2e8f0" }}
        />
      ))}
    </div>
  );
}

function KpiCard({ label, value, compact, sub, icon: Icon, iconBg, iconColor, badge, badgeColor, loading }) {
  if (loading) return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm animate-pulse">
      <div className="h-2.5 bg-slate-100 rounded w-1/3 mb-3" />
      <div className="h-7 bg-slate-100 rounded w-2/3 mb-2" />
      <div className="h-2 bg-slate-100 rounded w-1/2" />
    </div>
  );
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50/30 pointer-events-none" />
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
          {Icon && (
            <div className={`w-7 h-7 rounded-xl ${iconBg || "bg-slate-50"} flex items-center justify-center ${iconColor || "text-slate-400"} group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="text-lg font-black text-slate-900 tracking-tight leading-none truncate">{compact ?? value}</p>
            {value && compact && <p className="text-[10px] text-slate-400 font-semibold mt-0.5 truncate">{value}</p>}
          </div>
          {badge && (
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 ${badgeColor || "bg-slate-100 text-slate-500"}`}>{badge}</span>
          )}
        </div>
        {sub && <p className="text-[10px] text-slate-400 font-semibold mt-1.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function ReportsOverview({
  totalIncome  = 0,
  totalExpense = 0,
  netSavings   = 0,
  savingRate   = 0,
  monthlyData  = [],
  loading      = false,
}) {
  const { language } = useLanguage();
  const { formatCurrency, formatCompact } = useCurrency();
  const isDeficit  = netSavings < 0;
  const rateScore  = savingRate >= 30 ? "A" : savingRate >= 20 ? "B" : savingRate >= 10 ? "C" : "D";
  const rateGood   = savingRate >= 20;

  const months      = monthlyData.length;
  const avgIncome   = months > 0 ? totalIncome / months : 0;
  const avgExpense  = months > 0 ? totalExpense / months : 0;
  const bestMonth   = monthlyData.reduce((best, d) => (!best || d.income > best.income) ? d : best, null);
  const worstMonth  = monthlyData.reduce((worst, d) => (!worst || d.expense > worst.expense) ? d : worst, null);
  const surplusMonths = monthlyData.filter(d => (d.income - d.expense) >= 0).length;
  const deficitMonths = months - surplusMonths;
  const consistency   = months > 0 ? Math.round((surplusMonths / months) * 100) : 0;
  const burnRate      = totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0;

  const MONTH_ID = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  const MONTH_EN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const mLabel = (ym) => {
    if (!ym) return "-";
    const [, m] = ym.split("-");
    const names = language === 'en' ? MONTH_EN : MONTH_ID;
    return names[parseInt(m, 10) - 1] || m;
  };

  const insights = [];
  if (!loading && months > 0) {
    if (savingRate >= 20) insights.push({ icon: CheckCircle, color: "text-emerald-400", msg: language === 'en' ? `Saving rate ${savingRate}% — target ≥20% achieved. Your finances are well controlled.` : `Saving rate ${savingRate}% — target ≥20% tercapai. Keuangan Anda terkendali dengan baik.` });
    else insights.push({ icon: AlertTriangle, color: "text-amber-400", msg: language === 'en' ? `Saving rate ${savingRate}% is below the 20% target. Consider cutting non-essential expenses.` : `Saving rate ${savingRate}% di bawah target 20%. Pertimbangkan memotong pengeluaran non-esensial.` });
    if (deficitMonths > 0) insights.push({ icon: Info, color: "text-red-400", msg: language === 'en' ? `${deficitMonths} out of ${months} months experienced a deficit. Ensure emergency funds of at least 3 months expenses.` : `${deficitMonths} dari ${months} bulan mengalami defisit. Pastikan tersedia dana darurat minimal 3 bulan pengeluaran.` });
    if (burnRate > 80) insights.push({ icon: Zap, color: "text-orange-400", msg: language === 'en' ? `Burn rate ${burnRate}% — ${burnRate}% of income is spent on expenses. Increase your budget efficiency.` : `Burn rate ${burnRate}% — ${burnRate}% pemasukan habis untuk pengeluaran. Tingkatkan efisiensi anggaran Anda.` });
  }

  return (
    <div className="space-y-4">
      {/* ── Row 1: Primary KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
        {/* Net Savings Hero Card */}
        <div className={`col-span-2 lg:col-span-1 bg-gradient-to-br ${isDeficit ? "from-red-600 to-rose-700 shadow-red-500/20" : "from-[#00685F] to-[#004D46] shadow-[#00685F]/20"} text-white p-4 rounded-2xl shadow-lg relative overflow-hidden group`}>
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          {loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-2.5 bg-white/30 rounded w-1/2" /><div className="h-8 bg-white/30 rounded w-3/4" /><div className="h-2 bg-white/30 rounded w-1/3" />
            </div>
          ) : (
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[9px] font-black text-white/70 uppercase tracking-widest">{language === 'en' ? "Net Savings" : "Simpanan Bersih"}</p>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border border-white/20 ${isDeficit ? "bg-red-800/40 text-red-200" : "bg-white/20 text-white"}`}>
                  {isDeficit ? (language === 'en' ? "DEFICIT" : "DEFISIT") : (language === 'en' ? "SURPLUS" : "SURPLUS")} {rateScore}
                </span>
              </div>
              <p className="text-2xl font-black text-white tracking-tight leading-none">
                {isDeficit ? "-" : ""}{formatCompact(Math.abs(netSavings))}
              </p>
              <p className="text-[10px] text-white/70 font-semibold mt-1">{formatCurrency(Math.abs(netSavings))}</p>
              <p className="text-[10px] font-semibold text-white/60 mt-2 flex items-center gap-1">
                {isDeficit
                  ? <><TrendingDown className="w-3 h-3" /> {language === 'en' ? "Expenses exceed income" : "Pengeluaran melebihi pemasukan"}</>
                  : <><TrendingUp className="w-3 h-3" /> {language === 'en' ? "Finances are in good health" : "Keuangan dalam kondisi sehat"}</>}
              </p>
            </div>
          )}
        </div>

        {/* Saving Rate */}
        {loading ? (
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm animate-pulse"><div className="h-2.5 bg-slate-100 rounded w-1/3 mb-3" /><div className="h-8 bg-slate-100 rounded w-1/2 mb-3" /><div className="h-3 bg-slate-100 rounded w-full" /></div>
        ) : (
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Saving Rate</p>
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${rateGood ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-500"}`}>
                <Target className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <p className={`text-2xl font-black tracking-tighter ${rateGood ? "text-[#00685F]" : "text-amber-500"}`}>{savingRate}%</p>
              <span className={`text-[9px] font-black mb-1.5 px-2 py-0.5 rounded-full ${rateGood ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-600"}`}>
                {rateGood ? (language === 'en' ? "Good" : "Baik") : (language === 'en' ? "Low" : "Rendah")}
              </span>
            </div>
            <div className="mt-2 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${rateGood ? "bg-gradient-to-r from-[#00685F] to-emerald-400" : "bg-gradient-to-r from-amber-400 to-orange-400"}`}
                style={{ width: `${Math.min(savingRate, 100)}%` }}
              />
            </div>
            <p className="text-[9px] text-slate-400 font-semibold mt-1">{language === 'en' ? "Target: ≥ 20% of income" : "Target: ≥ 20% dari pemasukan"}</p>
          </div>
        )}

        <KpiCard
          label={language === 'en' ? "Total Income" : "Total Pemasukan"}
          compact={formatCompact(totalIncome)}
          value={formatCurrency(totalIncome)}
          icon={TrendingUp} iconBg="bg-emerald-50" iconColor="text-emerald-500"
          sub={months > 0 ? (language === 'en' ? `Average ${formatCompact(avgIncome)}/mo` : `Rata-rata ${formatCompact(avgIncome)}/bln`) : undefined}
          loading={loading}
        />
        <KpiCard
          label={language === 'en' ? "Total Expense" : "Total Pengeluaran"}
          compact={formatCompact(totalExpense)}
          value={formatCurrency(totalExpense)}
          icon={TrendingDown} iconBg="bg-red-50" iconColor="text-red-500"
          sub={months > 0 ? (language === 'en' ? `Average ${formatCompact(avgExpense)}/mo` : `Rata-rata ${formatCompact(avgExpense)}/bln`) : undefined}
          badge={totalIncome > 0 ? `Burn ${burnRate}%` : undefined}
          badgeColor={burnRate > 80 ? "bg-red-100 text-red-600" : burnRate > 60 ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500"}
          loading={loading}
        />
      </div>

      {/* ── Row 2: Secondary Stats ── */}
      {!loading && months > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{language === 'en' ? "Period" : "Periode"}</p>
            <p className="text-xl font-black text-slate-900">{months}</p>
            <p className="text-[10px] text-slate-400 font-semibold">{language === 'en' ? "months analyzed" : "bulan dianalisis"}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{language === 'en' ? "Surplus Months" : "Bulan Surplus"}</p>
            <p className="text-xl font-black text-emerald-600">{surplusMonths}</p>
            <p className="text-[10px] text-slate-400 font-semibold">{language === 'en' ? `out of ${months} months` : `dari ${months} bulan`}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{language === 'en' ? "Deficit Months" : "Bulan Defisit"}</p>
            <p className={`text-xl font-black ${deficitMonths > 0 ? "text-red-500" : "text-emerald-600"}`}>{deficitMonths}</p>
            <p className="text-[10px] text-slate-400 font-semibold">{language === 'en' ? `out of ${months} months` : `dari ${months} bulan`}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{language === 'en' ? "Consistency" : "Konsistensi"}</p>
            <p className={`text-xl font-black ${consistency >= 70 ? "text-[#00685F]" : consistency >= 50 ? "text-amber-500" : "text-red-500"}`}>{consistency}%</p>
            <MiniBar pct={consistency} color={consistency >= 70 ? "#00685F" : consistency >= 50 ? "#f59e0b" : "#ef4444"} />
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{language === 'en' ? "Best Month" : "Bulan Terbaik"}</p>
            <p className="text-xl font-black text-emerald-600">{bestMonth ? mLabel(bestMonth.month) : "-"}</p>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{bestMonth ? formatCompact(bestMonth.income) : "-"} {language === 'en' ? "income" : "pemasukan"}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{language === 'en' ? "Max Expense" : "Pengeluaran Max"}</p>
            <p className="text-xl font-black text-red-600">{worstMonth ? mLabel(worstMonth.month) : "-"}</p>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{worstMonth ? formatCompact(worstMonth.expense) : "-"} {language === 'en' ? "expense" : "keluar"}</p>
          </div>
        </div>
      )}

      {/* ── Row 3: Health Score + Insight Panel ── */}
      {!loading && months > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
            <HealthGauge rate={savingRate} language={language} />
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Financial Health Score</p>
              <p className="text-3xl font-black text-slate-900 leading-none">{rateScore}</p>
              <p className="text-[10px] text-slate-500 font-semibold mt-1">
                {language === 'en' ? `Saving rate ${savingRate}% of total income` : `Saving rate ${savingRate}% dari total pemasukan`}
              </p>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {["D","C","B","A"].map(g => (
                  <span key={g} className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${rateScore === g ? (g === "A" ? "bg-[#00685F] text-white" : g === "B" ? "bg-emerald-500 text-white" : g === "C" ? "bg-amber-500 text-white" : "bg-red-500 text-white") : "bg-slate-100 text-slate-400"}`}>
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 p-5 rounded-2xl shadow-md relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-[#00685F]/10 rounded-full blur-3xl pointer-events-none" />
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-[#00685F]" /> {language === 'en' ? "Analyst Insights & Recommendations" : "Insight & Rekomendasi Analis"}
            </p>
            <div className="space-y-2">
              {insights.map((ins, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-white/5 rounded-xl p-2.5 border border-white/5">
                  <ins.icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${ins.color}`} />
                  <p className="text-[11px] font-semibold text-slate-200 leading-relaxed">{ins.msg}</p>
                </div>
              ))}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10">
                <div className="text-center">
                  <p className="text-sm font-black text-white">{formatCompact(avgIncome)}</p>
                  <p className="text-[9px] text-slate-400 font-semibold">{language === 'en' ? "Avg Income/Mo" : "Avg Masuk/Bln"}</p>
                </div>
                <div className="text-center border-x border-white/10">
                  <p className="text-sm font-black text-white">{formatCompact(avgExpense)}</p>
                  <p className="text-[9px] text-slate-400 font-semibold">{language === 'en' ? "Avg Expense/Mo" : "Avg Keluar/Bln"}</p>
                </div>
                <div className="text-center">
                  <p className={`text-sm font-black ${isDeficit ? "text-red-400" : "text-emerald-400"}`}>{formatCompact(Math.abs(avgIncome - avgExpense))}</p>
                  <p className="text-[9px] text-slate-400 font-semibold">{language === 'en' ? "Avg Net/Mo" : "Avg Net/Bln"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
