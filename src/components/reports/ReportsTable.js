"use client";

import { useState } from "react";
import { ArrowUpDown, Search, TrendingUp, TrendingDown, Award, AlertCircle, Minus } from "lucide-react";

const MONTH_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
function monthLabel(ym) {
  if (!ym) return ym;
  const [y, m] = ym.split("-");
  return (MONTH_ID[parseInt(m, 10) - 1] || m) + " " + y;
}
function monthLabelShort(ym) {
  if (!ym) return ym;
  const [y, m] = ym.split("-");
  const MONTH_SHORT = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  return (MONTH_SHORT[parseInt(m, 10) - 1] || m) + " " + y.slice(2);
}

const fmt = (v) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v ?? 0);

const fmtCompact = (val) => {
  const abs = Math.abs(val ?? 0);
  if (abs >= 1_000_000_000) return (val / 1_000_000_000).toFixed(1) + "M";
  if (abs >= 1_000_000) return (val / 1_000_000).toFixed(1) + "Jt";
  if (abs >= 1_000) return (val / 1_000).toFixed(0) + "Rb";
  return String(val ?? 0);
};

function BarCell({ value, max, color }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden min-w-[40px]">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[10px] font-bold text-slate-400 w-8 text-right">{pct.toFixed(0)}%</span>
    </div>
  );
}

function GrowthBadge({ current, previous }) {
  if (previous === undefined || previous === null) return <span className="text-[10px] text-slate-300 font-bold">—</span>;
  if (previous === 0) return <span className="text-[10px] text-slate-300 font-bold">—</span>;
  const delta = ((current - previous) / previous) * 100;
  const isUp = delta > 0;
  const isFlat = Math.abs(delta) < 0.5;
  if (isFlat) return <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-slate-400"><Minus className="w-2.5 h-2.5" />0%</span>;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-black ${isUp ? "text-emerald-600" : "text-red-500"}`}>
      {isUp ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
      {Math.abs(delta).toFixed(1)}%
    </span>
  );
}

export default function ReportsTable({ monthlyData = [], loading = false }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");

  const rawData = monthlyData.map((d, i) => {
    const prev = i > 0 ? monthlyData[i - 1] : null;
    const cf = d.cashflow ?? (d.income - d.expense);
    const expRatio = d.income > 0 ? Math.round((d.expense / d.income) * 100) : 0;
    return {
      month:    d.month,
      income:   d.income  || 0,
      expense:  d.expense || 0,
      cashflow: cf,
      expRatio,
      status:   cf >= 0 ? "Surplus" : "Defisit",
      prevIncome:  prev ? (prev.income  || 0) : null,
      prevExpense: prev ? (prev.expense || 0) : null,
    };
  });

  const filtered = rawData.filter(
    (r) =>
      monthLabel(r.month).toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    return sortOrder === "asc" ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
  });

  const handleSort = (field) => {
    if (sortField === field) setSortOrder(o => o === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortOrder("desc"); }
  };

  const totalIncome   = rawData.reduce((s, r) => s + r.income,   0);
  const totalExpense  = rawData.reduce((s, r) => s + r.expense,  0);
  const totalCashflow = totalIncome - totalExpense;
  const maxIncome     = Math.max(...rawData.map(r => r.income),  1);
  const maxExpense    = Math.max(...rawData.map(r => r.expense), 1);
  const maxCashflow   = Math.max(...rawData.map(r => r.cashflow), 0);
  const bestMonthRow  = rawData.reduce((best, r) => r.cashflow > (best?.cashflow ?? -Infinity) ? r : best, null);
  const months        = rawData.length;
  const surplusCount  = rawData.filter(r => r.cashflow >= 0).length;

  const SortBtn = ({ field, label }) => (
    <button onClick={() => handleSort(field)} className="flex items-center gap-1 group cursor-pointer hover:text-[#00685F] transition-colors whitespace-nowrap">
      {label}
      <ArrowUpDown className={`w-3 h-3 ${sortField === field ? "text-[#00685F]" : "text-slate-300"} group-hover:text-[#00685F]`} />
    </button>
  );

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-7 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-black text-slate-900 text-base sm:text-lg tracking-tight">Rincian Bulanan</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Analisis arus kas, rasio pengeluaran & pertumbuhan per bulan</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari bulan atau status..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#00685F]/20 focus:border-[#00685F] transition"
            />
          </div>
        </div>

        {/* Summary pills */}
        {!loading && months > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-black px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-slate-400" />{months} bulan
            </span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black px-3 py-1.5 rounded-full">
              <Award className="w-3 h-3" />{surplusCount} Surplus
            </span>
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full border ${(months - surplusCount) > 0 ? "bg-red-50 border-red-100 text-red-600" : "bg-slate-50 border-slate-100 text-slate-500"}`}>
              <AlertCircle className="w-3 h-3" />{months - surplusCount} Defisit
            </span>
            {bestMonthRow && (
              <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-black px-3 py-1.5 rounded-full">
                Best: {monthLabelShort(bestMonthRow.month)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="text-left px-5 py-3.5 text-[9px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">Bulan</th>
              <th className="text-right px-5 py-3.5 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                <SortBtn field="income" label="Pemasukan" />
              </th>
              <th className="text-right px-5 py-3.5 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                <SortBtn field="expense" label="Pengeluaran" />
              </th>
              <th className="text-left px-5 py-3.5 text-[9px] font-black text-slate-400 uppercase tracking-wider min-w-[120px]">Rasio Pengeluaran</th>
              <th className="text-right px-5 py-3.5 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                <SortBtn field="cashflow" label="Net Cashflow" />
              </th>
              <th className="text-center px-5 py-3.5 text-[9px] font-black text-slate-400 uppercase tracking-wider">Growth</th>
              <th className="text-center px-5 py-3.5 text-[9px] font-black text-slate-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-slate-50 animate-pulse">
                  {Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} className="px-5 py-4"><div className="h-3 bg-slate-100 rounded w-full" /></td>
                  ))}
                </tr>
              ))
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-14 text-center text-slate-300 text-xs font-bold">
                  {searchQuery ? `Tidak ditemukan: "${searchQuery}"` : "Belum ada data pada periode ini"}
                </td>
              </tr>
            ) : (
              sorted.map((row) => {
                const isBest = row.month === bestMonthRow?.month;
                const isPositive = row.cashflow >= 0;
                return (
                  <tr key={row.month} className={`border-b border-slate-50 hover:bg-slate-50/60 transition-colors group ${isBest ? "bg-[#E6F0EF]/20" : ""}`}>
                    {/* Month */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {isBest && <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                        <div>
                          <p className="font-bold text-slate-800 text-xs whitespace-nowrap">{monthLabel(row.month)}</p>
                          {isBest && <p className="text-[9px] text-amber-600 font-black">Best Month</p>}
                        </div>
                      </div>
                    </td>

                    {/* Income */}
                    <td className="px-5 py-3.5 text-right">
                      <p className="text-xs font-bold text-emerald-700 whitespace-nowrap">{fmtCompact(row.income)}</p>
                      <p className="text-[9px] text-slate-400 font-semibold">{fmt(row.income)}</p>
                    </td>

                    {/* Expense */}
                    <td className="px-5 py-3.5 text-right">
                      <p className="text-xs font-bold text-red-500 whitespace-nowrap">{fmtCompact(row.expense)}</p>
                      <p className="text-[9px] text-slate-400 font-semibold">{fmt(row.expense)}</p>
                    </td>

                    {/* Expense Ratio bar */}
                    <td className="px-5 py-3.5 min-w-[140px]">
                      <BarCell value={row.expense} max={row.income > 0 ? row.income : maxExpense} color={row.expRatio > 80 ? "#ef4444" : row.expRatio > 60 ? "#f59e0b" : "#00685F"} />
                    </td>

                    {/* Net Cashflow */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {isPositive
                          ? <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          : <TrendingDown className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                        <div>
                          <p className={`text-xs font-black whitespace-nowrap ${isPositive ? "text-emerald-700" : "text-red-500"}`}>
                            {isPositive ? "+" : "-"}{fmtCompact(Math.abs(row.cashflow))}
                          </p>
                          <p className="text-[9px] text-slate-400 font-semibold">{fmt(Math.abs(row.cashflow))}</p>
                        </div>
                      </div>
                    </td>

                    {/* Growth vs prev */}
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <GrowthBadge current={row.income} previous={row.prevIncome} />
                        <p className="text-[8px] text-slate-300 font-semibold">income</p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5 text-center">
                      <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border select-none whitespace-nowrap ${isPositive ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {/* Footer */}
          {!loading && sorted.length > 0 && (
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                <td className="px-5 py-4">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Total Periode</p>
                  <p className="text-[9px] text-slate-400 font-semibold">{months} bulan</p>
                </td>
                <td className="px-5 py-4 text-right">
                  <p className="text-xs font-black text-emerald-700 whitespace-nowrap">{fmtCompact(totalIncome)}</p>
                  <p className="text-[9px] text-slate-400 font-semibold">{fmt(totalIncome)}</p>
                </td>
                <td className="px-5 py-4 text-right">
                  <p className="text-xs font-black text-red-500 whitespace-nowrap">{fmtCompact(totalExpense)}</p>
                  <p className="text-[9px] text-slate-400 font-semibold">{fmt(totalExpense)}</p>
                </td>
                <td className="px-5 py-4">
                  <BarCell value={totalExpense} max={totalIncome > 0 ? totalIncome : maxExpense} color={totalExpense / totalIncome > 0.8 ? "#ef4444" : "#00685F"} />
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {totalCashflow >= 0 ? <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <TrendingDown className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                    <div>
                      <p className={`text-xs font-black whitespace-nowrap ${totalCashflow >= 0 ? "text-emerald-700" : "text-red-500"}`}>
                        {totalCashflow >= 0 ? "+" : "-"}{fmtCompact(Math.abs(totalCashflow))}
                      </p>
                      <p className="text-[9px] text-slate-400 font-semibold">{fmt(Math.abs(totalCashflow))}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-center">
                  <span className="text-[9px] text-slate-400 font-bold">—</span>
                </td>
                <td className="px-5 py-4 text-center">
                  <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border ${totalCashflow >= 0 ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                    {totalCashflow >= 0 ? "Surplus" : "Defisit"}
                  </span>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
