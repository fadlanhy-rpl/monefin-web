"use client";

import { useState } from "react";
import { ArrowUpDown, Search, TrendingUp, TrendingDown, Minus } from "lucide-react";

const MONTH_ID = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember"
];

function monthLabel(ym) {
  if (!ym) return ym;
  const [y, m] = ym.split("-");
  return (MONTH_ID[parseInt(m, 10) - 1] || m) + " " + y;
}

const fmt = (v) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0,
  }).format(v);

export default function ReportsTable({ monthlyData = [], loading = false }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField]     = useState(null);
  const [sortOrder, setSortOrder]     = useState("desc");

  const rawData = monthlyData.map((d) => ({
    month:    d.month,
    income:   d.income   || 0,
    expense:  d.expense  || 0,
    cashflow: d.cashflow ?? (d.income - d.expense),
    status:   (d.cashflow ?? (d.income - d.expense)) >= 0 ? "Surplus" : "Defisit",
  }));

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
    if (sortField === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const totalIncome   = rawData.reduce((s, r) => s + r.income,   0);
  const totalExpense  = rawData.reduce((s, r) => s + r.expense,  0);
  const totalCashflow = totalIncome - totalExpense;
  const maxCashflow   = Math.max(...rawData.map((r) => r.cashflow), 0);

  const SortBtn = ({ field, label }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 group cursor-pointer hover:text-[#00685F] transition-colors"
    >
      {label}
      <ArrowUpDown className={`w-3 h-3 ${sortField === field ? "text-[#00685F]" : "text-slate-400"} group-hover:text-[#00685F]`} />
    </button>
  );

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-7 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-black text-slate-900 text-base sm:text-lg tracking-tight">Ringkasan Bulanan</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Data agregat income, expense & cashflow per bulan</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari bulan atau status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#00685F]/20 focus:border-[#00685F] transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="text-left px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">Bulan</th>
              <th className="text-right px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <SortBtn field="income" label="Pemasukan" />
              </th>
              <th className="text-right px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <SortBtn field="expense" label="Pengeluaran" />
              </th>
              <th className="text-right px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <SortBtn field="cashflow" label="Net Cashflow" />
              </th>
              <th className="text-center px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-slate-50 animate-pulse">
                  {Array.from({ length: 5 }).map((__, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-3 bg-slate-100 rounded w-full"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-300 text-xs font-bold">
                  {searchQuery ? `Tidak ditemukan hasil untuk "${searchQuery}"` : "Belum ada data pada periode ini"}
                </td>
              </tr>
            ) : (
              sorted.map((row) => {
                const isMax      = row.cashflow === maxCashflow && maxCashflow > 0;
                const isPositive = row.cashflow >= 0;
                return (
                  <tr
                    key={row.month}
                    className={`border-b border-slate-50 hover:bg-slate-50/60 transition-colors ${isMax ? "bg-[#E6F0EF]/30" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-xs whitespace-nowrap">{monthLabel(row.month)}</span>
                        {isMax && (
                          <span className="text-[9px] font-black bg-amber-50 text-amber-600 border border-amber-100 px-1.5 py-0.5 rounded-full select-none">Best</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs font-bold text-emerald-700">{fmt(row.income)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs font-bold text-red-500">{fmt(row.expense)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {isPositive
                          ? <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          : <TrendingDown className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                        <span className={`text-xs font-black ${isPositive ? "text-emerald-700" : "text-red-500"}`}>
                          {fmt(Math.abs(row.cashflow))}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border select-none ${
                        isPositive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-red-50 text-red-600 border-red-100"
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {/* Footer Totals */}
          {!loading && sorted.length > 0 && (
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50/80">
                <td className="px-6 py-4">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">TOTAL PERIODE</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-xs font-black text-emerald-700">{fmt(totalIncome)}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-xs font-black text-red-500">{fmt(totalExpense)}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {totalCashflow >= 0
                      ? <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      : <TrendingDown className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                    <span className={`text-xs font-black ${totalCashflow >= 0 ? "text-emerald-700" : "text-red-500"}`}>
                      {fmt(Math.abs(totalCashflow))}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border select-none ${
                    totalCashflow >= 0
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-red-50 text-red-600 border-red-100"
                  }`}>
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
