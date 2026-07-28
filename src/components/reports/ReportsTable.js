import { ArrowUpRight } from "lucide-react";

export default function ReportsTable({ monthlyData }) {
  const defaultData = [
    { month: "Januari 2026", income: 8000000, expense: 3200000, cashflow: 4800000, status: "Surplus" },
    { month: "Februari 2026", income: 8500000, expense: 4100000, cashflow: 4400000, status: "Surplus" },
    { month: "Maret 2026", income: 7800000, expense: 5200000, cashflow: 2600000, status: "Surplus" },
    { month: "April 2026", income: 9200000, expense: 4000000, cashflow: 5200000, status: "Surplus" },
    { month: "Mei 2026", income: 8900000, expense: 3500000, cashflow: 5400000, status: "Surplus" },
    { month: "Juni 2026", income: 10500000, expense: 6000000, cashflow: 4500000, status: "Surplus" },
  ];

  const data = monthlyData || defaultData;

  const totalIncome = data.reduce((acc, row) => acc + row.income, 0);
  const totalExpense = data.reduce((acc, row) => acc + row.expense, 0);
  const totalCashflow = totalIncome - totalExpense;

  const formatRupiah = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Table Header Row */}
      <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-50">
        <h3 className="font-extrabold text-slate-800 text-base sm:text-lg">Monthly Performance Summary</h3>
        <button 
          onClick={() => alert("Membuka Ledger Detail...")}
          className="text-xs font-bold text-[#00685F] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Detailed Ledger</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/60 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 select-none">
            <tr>
              <th className="px-6 py-4">Bulan</th>
              <th className="px-6 py-4">Pemasukan (Income)</th>
              <th className="px-6 py-4 text-red-500/80">Pengeluaran (Expense)</th>
              <th className="px-6 py-4">Net Cashflow</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="text-xs font-medium divide-y divide-slate-50">
            {data.map((row) => (
              <tr key={row.month} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-6 py-4 text-slate-600 font-semibold">{row.month}</td>
                <td className="px-6 py-4 text-[#00685F] font-bold">{formatRupiah(row.income)}</td>
                <td className="px-6 py-4 text-red-500/80 font-bold">{formatRupiah(row.expense)}</td>
                <td className="px-6 py-4 font-black text-slate-900">+{formatRupiah(row.cashflow)}</td>
                <td className="px-6 py-4 select-none">
                  <span className="bg-emerald-100/80 text-emerald-800 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border border-emerald-200/50">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-100/40 text-xs sm:text-sm font-bold border-t-2 border-slate-100 select-none">
            <tr>
              <td className="px-6 py-5 text-slate-700 italic font-bold">Semester Total</td>
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
