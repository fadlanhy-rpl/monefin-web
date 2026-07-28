"use client";

import { useState } from "react";
import { ArrowUpRight, Search, ArrowUpDown, Sparkles } from "lucide-react";

export default function ReportsTable({ monthlyData }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState(null); // null | "income" | "expense" | "cashflow"
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" | "desc"

  const defaultData = [
    { month: "Januari 2026", income: 8000000, expense: 3200000, cashflow: 4800000, status: "Surplus" },
    { month: "Februari 2026", income: 8500000, expense: 4100000, cashflow: 4400000, status: "Surplus" },
    { month: "Maret 2026", income: 7800000, expense: 5200000, cashflow: 2600000, status: "Surplus" },
    { month: "April 2026", income: 9200000, expense: 4000000, cashflow: 5200000, status: "Surplus" },
    { month: "Mei 2026", income: 8900000, expense: 3500000, cashflow: 5400000, status: "Surplus" },
    { month: "Juni 2026", income: 10500000, expense: 6000000, cashflow: 4500000, status: "Surplus" },
  ];

  const rawData = monthlyData || defaultData;

  // Filter rows based on search query
  const filteredData = rawData.filter(row => 
    row.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort rows based on sortField
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];
    return sortOrder === "asc" ? valA - valB : valB - valA;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Identify highest cashflow month
  const maxCashflowVal = Math.max(...rawData.map(r => r.cashflow));

  const totalIncome = rawData.reduce((acc, row) => acc + row.income, 0);
  const totalExpense = rawData.reduce((acc, row) => acc + row.expense, 0);
  const totalCashflow = totalIncome - totalExpense;

  const formatRupiah = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Table Header Row with Filter & Search */}
      <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100">
        <div>
          <h3 className="font-black text-slate-900 text-base sm:text-lg tracking-tight">Monthly Performance Summary</h3>
          <p className="text-xs text-slate-400 mt-0.5">Rincian arus kas bulanan dan performa finansial</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Table Search Bar */}
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Cari bulan atau status..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-1.5 pl-8 pr-3 text-xs focus:border-[#00685F] focus:outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <button 
            onClick={() => alert("Membuka Buku Kas Detail (Ledger)...")}
            className="text-xs font-extrabold text-[#00685F] hover:underline flex items-center gap-1 cursor-pointer select-none"
          >
            <span>Detailed Ledger</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/70 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 select-none">
            <tr>
              <th className="px-6 py-4">Bulan</th>
              <th 
                onClick={() => handleSort("income")}
                className="px-6 py-4 hover:text-[#00685F] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Pemasukan (Income)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                onClick={() => handleSort("expense")}
                className="px-6 py-4 text-red-500/80 hover:text-red-600 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Pengeluaran (Expense)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                onClick={() => handleSort("cashflow")}
                className="px-6 py-4 hover:text-[#00685F] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Net Cashflow</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="text-xs font-medium divide-y divide-slate-50">
            {sortedData.length > 0 ? (
              sortedData.map((row) => {
                const isMaxCashflow = row.cashflow === maxCashflowVal;
                return (
                  <tr key={row.month} className={`transition-colors ${isMaxCashflow ? 'bg-[#E6F0EF]/30' : 'hover:bg-slate-50/60'}`}>
                    <td className="px-6 py-4 text-slate-700 font-bold flex items-center gap-2">
                      <span>{row.month}</span>
                      {isMaxCashflow && (
                        <span className="bg-[#00685F] text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs animate-pulse">
                          <Sparkles className="w-2.5 h-2.5" /> Best
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[#00685F] font-extrabold">{formatRupiah(row.income)}</td>
                    <td className="px-6 py-4 text-red-500/80 font-extrabold">{formatRupiah(row.expense)}</td>
                    <td className="px-6 py-4 font-black text-slate-900">+{formatRupiah(row.cashflow)}</td>
                    <td className="px-6 py-4 select-none">
                      <span className="bg-emerald-100/80 text-emerald-800 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border border-emerald-200/50">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8 text-slate-400 text-xs font-bold">
                  Tidak ada data bulan yang cocok dengan pencarian "{searchQuery}".
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className="bg-slate-100/40 text-xs sm:text-sm font-bold border-t-2 border-slate-100 select-none">
            <tr>
              <td className="px-6 py-5 text-slate-700 italic font-black">Semester Total</td>
              <td className="px-6 py-5 text-[#00685F] font-black">{formatRupiah(totalIncome)}</td>
              <td className="px-6 py-5 text-red-500/80 font-black">{formatRupiah(totalExpense)}</td>
              <td className="px-6 py-5 text-[#00685F] font-black">{formatRupiah(totalCashflow)}</td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-xs animate-pulse"></span>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Optimal Growth</span>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
