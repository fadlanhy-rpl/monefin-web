import { ChevronRight } from "lucide-react";

const monthlySummary = [
  { month: "Januari 2026", income: "Rp 8.000.000", expense: "Rp 3.200.000", net: "+Rp 4.800.000", status: "Surplus" },
  { month: "Februari 2026", income: "Rp 8.500.000", expense: "Rp 4.100.000", net: "+Rp 4.400.000", status: "Surplus" },
  { month: "Maret 2026", income: "Rp 7.800.000", expense: "Rp 5.200.000", net: "+Rp 2.600.000", status: "Surplus" },
  { month: "April 2026", income: "Rp 9.200.000", expense: "Rp 4.000.000", net: "+Rp 5.200.000", status: "Surplus" },
  { month: "Mei 2026", income: "Rp 8.900.000", expense: "Rp 3.500.000", net: "+Rp 5.400.000", status: "Surplus" },
  { month: "Juni 2026", income: "Rp 10.500.000", expense: "Rp 6.000.000", net: "+Rp 4.500.000", status: "Surplus" }
];

export default function ReportsTable({ onDetailedLedgerClick }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 flex justify-between items-center border-b border-slate-50">
        <h4 className="font-bold text-slate-800 text-base sm:text-lg">Monthly Performance Summary</h4>
        <button 
          onClick={onDetailedLedgerClick}
          className="text-xs font-bold text-[#00685F] hover:underline flex items-center gap-1 cursor-pointer select-none"
        >
          Detailed Ledger <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest select-none">
            <tr>
              <th className="px-6 py-4">Bulan</th>
              <th className="px-6 py-4">Pemasukan (Income)</th>
              <th className="px-6 py-4 text-red-500/80">Pengeluaran (Expense)</th>
              <th className="px-6 py-4">Net Cashflow</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="text-xs font-medium divide-y divide-slate-50">
            {monthlySummary.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 text-slate-600 font-semibold">{row.month}</td>
                <td className="px-6 py-4 text-[#00685F] font-bold">{row.income}</td>
                <td className="px-6 py-4 text-red-500/80 font-bold">{row.expense}</td>
                <td className="px-6 py-4 font-black text-slate-900">{row.net}</td>
                <td className="px-6 py-4">
                  <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-100/30 text-sm font-bold border-t border-slate-100">
            <tr>
              <td className="px-6 py-5 sm:py-6 text-slate-700 italic font-semibold">Semester Total</td>
              <td className="px-6 py-5 sm:py-6 text-[#00685F] font-black">Rp 52.900.000</td>
              <td className="px-6 py-5 sm:py-6 text-red-500/80 font-black">Rp 26.000.000</td>
              <td className="px-6 py-5 sm:py-6 text-[#00685F] font-black">Rp 26.900.000</td>
              <td className="px-6 py-5 sm:py-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
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
