"use client";

import { useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { 
  Banknote, 
  Utensils, 
  Car, 
  ShoppingBag, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Download, 
  Filter, 
  Pencil, 
  Trash2, 
  Plus, 
  Wallet, 
  ShoppingCart, 
  BarChart3, 
  FileSpreadsheet
} from "lucide-react";

function formatRupiah(n) {
  const abs = Math.abs(n).toLocaleString('id-ID');
  return (n < 0 ? '- ' : '+ ') + 'Rp ' + abs;
}

export default function TransactionsPage() {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [accountFilter, setAccountFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Initial transactions dataset
  const [transactions, setTransactions] = useState([
    { 
      id: 1, 
      date: '24 Okt 2023', 
      category: 'Salary', 
      account: 'Bank Central Asia', 
      note: 'Monthly professional fee', 
      amount: 8000000, 
      type: 'income', 
      icon: <Banknote className="w-3 h-3" />, 
      catClass: 'bg-emerald-50 text-emerald-700' 
    },
    { 
      id: 2, 
      date: '23 Okt 2023', 
      category: 'Food & Drink', 
      account: 'GoPay Wallet', 
      note: 'Lunch at Union', 
      amount: -155000, 
      type: 'expense', 
      icon: <Utensils className="w-3 h-3" />, 
      catClass: 'bg-red-50 text-red-700' 
    },
    { 
      id: 3, 
      date: '22 Okt 2023', 
      category: 'Transport', 
      account: 'Mandiri Bank', 
      note: 'Fuel recharge', 
      amount: -350000, 
      type: 'expense', 
      icon: <Car className="w-3 h-3" />, 
      catClass: 'bg-blue-50 text-blue-700' 
    },
    { 
      id: 4, 
      date: '21 Okt 2023', 
      category: 'Shopping', 
      account: 'Credit Card', 
      note: 'Amazon - Gadgets', 
      amount: -1250000, 
      type: 'expense', 
      icon: <ShoppingBag className="w-3 h-3" />, 
      catClass: 'bg-orange-50 text-orange-700' 
    },
    { 
      id: 5, 
      date: '20 Okt 2023', 
      category: 'Investment', 
      account: 'Stock Portfolio', 
      note: 'Dividend payout', 
      amount: 450000, 
      type: 'income', 
      icon: <TrendingUp className="w-3 h-3" />, 
      catClass: 'bg-teal-50 text-teal-700' 
    },
  ]);

  // Filter logic
  const filteredTransactions = transactions.filter(t => {
    const matchesCategory = categoryFilter === "All" || t.category === categoryFilter;
    const matchesAccount = accountFilter === "All" || t.account === accountFilter;
    const matchesSearch = 
      t.note.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.account.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesAccount && matchesSearch;
  });

  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleAddTransaction = () => {
    alert("Fitur Tambah Transaksi akan diintegrasikan dengan database backend Laravel.");
  };

  const handleExport = () => {
    alert("Mengekspor data transaksi ke format CSV / Excel...");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Transactions History</h2>
            <p className="text-gray-500 text-sm mt-1">Comprehensive record of your financial movements across all linked accounts.</p>
          </div>
          <button 
            onClick={handleAddTransaction}
            className="flex items-center justify-center gap-2 bg-[#00685F] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#004D46] hover:shadow-lg transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-5 h-5" />
            Add Transaction
          </button>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Filters</span>
          
          <div className="flex flex-wrap gap-2 flex-1">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold outline-none text-slate-600 focus:ring-1 focus:ring-[#00685F]"
            >
              <option value="All">Category: All</option>
              <option value="Salary">Salary</option>
              <option value="Food & Drink">Food & Drink</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Investment">Investment</option>
            </select>
            
            <select className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold outline-none text-slate-600 focus:ring-1 focus:ring-[#00685F]">
              <option>Date: Last 30 Days</option>
              <option>Date: This Month</option>
              <option>Date: Last 7 Days</option>
            </select>
            
            <select 
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold outline-none text-slate-600 focus:ring-1 focus:ring-[#00685F]"
            >
              <option value="All">Account: All Accounts</option>
              <option value="Bank Central Asia">Bank Central Asia</option>
              <option value="GoPay Wallet">GoPay Wallet</option>
              <option value="Mandiri Bank">Mandiri Bank</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Stock Portfolio">Stock Portfolio</option>
            </select>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-50 border border-gray-100 rounded-xl py-2 pl-9 pr-4 text-xs w-full focus:ring-1 focus:ring-[#00685F] outline-none text-slate-600" 
                placeholder="Search transactions..."
              />
            </div>
            <button 
              onClick={handleExport}
              title="Export CSV"
              className="p-2 border border-gray-100 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors active:scale-95"
            >
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 border border-gray-100 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors active:scale-95">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                <tr>
                  <th className="px-6 py-5">Date</th>
                  <th className="px-6 py-5">Category</th>
                  <th className="px-6 py-5">Account</th>
                  <th className="px-6 py-5">Note</th>
                  <th className="px-6 py-5 text-right">Amount</th>
                  <th className="px-6 py-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm text-slate-600">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t) => {
                    const isExpense = t.amount < 0;
                    const amountText = (isExpense ? "- " : "+ ") + "Rp " + Math.abs(t.amount).toLocaleString('id-ID');
                    const amountClass = isExpense ? "text-red-600 font-bold" : "text-emerald-600 font-bold";

                    return (
                      <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 text-gray-500 font-medium whitespace-nowrap">{t.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold ${t.catClass}`}>
                            {t.icon}
                            {t.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-800 text-xs whitespace-nowrap">{t.account}</td>
                        <td className="px-6 py-4 text-gray-400 text-xs max-w-xs truncate" title={t.note}>{t.note}</td>
                        <td className={`px-6 py-4 text-right whitespace-nowrap ${amountClass}`}>{amountText}</td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <div className="flex justify-center gap-2 text-gray-400">
                            <button className="hover:text-[#00685F] transition-colors p-1"><Pencil className="w-4 h-4" /></button>
                            <button 
                              onClick={() => handleDelete(t.id)}
                              className="hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="py-10 text-center text-sm font-semibold text-slate-400">
                      Tidak ada transaksi yang cocok dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-5 bg-white border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 font-medium text-center">
              Showing <span className="text-slate-900 font-bold">1-{filteredTransactions.length}</span> of <span class="text-slate-900 font-bold">{filteredTransactions.length}</span> transactions
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 text-xs border border-gray-100 rounded-xl font-bold text-gray-300 cursor-not-allowed">&lt; Previous</button>
              <div className="flex gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#00685F] text-white text-xs font-bold">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-xs font-bold text-slate-600">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-xs font-bold text-slate-600">3</button>
                <span className="text-gray-300 px-1">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-xs font-bold text-slate-600">13</button>
              </div>
              <button className="px-3 py-2 text-xs border border-gray-100 rounded-xl font-bold hover:bg-gray-50 text-slate-600">Next &gt;</button>
            </div>
          </div>
        </div>

        {/* Footer Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10">
          {/* Income Card */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Income</p>
                <h3 className="text-2xl font-black text-slate-900 mt-2">Rp 12.450.000</h3>
                <p className="text-[10px] text-gray-400 mt-1">This current month</p>
              </div>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><Wallet className="w-6 h-6" /></div>
            </div>
            <div className="flex items-center gap-2 self-start bg-emerald-50 px-2 py-1 rounded-lg">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span className="text-[10px] font-black text-emerald-600">12.5%</span>
            </div>
          </div>

          {/* Expenses Card */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Expenses</p>
                <h3 className="text-2xl font-black text-slate-900 mt-2">Rp 4.820.000</h3>
                <p className="text-[10px] text-gray-400 mt-1">This current month</p>
              </div>
              <div className="p-2.5 bg-red-50 text-red-600 rounded-xl"><ShoppingCart className="w-6 h-6" /></div>
            </div>
            <div className="flex items-center gap-2 self-start bg-red-50 px-2 py-1 rounded-lg">
              <TrendingDown className="w-3 h-3 text-red-600" />
              <span className="text-[10px] font-black text-red-600">3.2%</span>
            </div>
          </div>

          {/* Net Cash Card */}
          <div className="bg-[#E6F0EF]/60 p-6 rounded-[2.5rem] border border-[#c0ded9]/50 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div className="relative z-10">
                <p className="text-[10px] font-black text-[#00685F] uppercase tracking-widest">Net Cash Flow</p>
                <h3 className="text-2xl font-black text-slate-900 mt-2">Rp 7.630.000</h3>
                <p className="text-[10px] text-[#00685F]/60 mt-1">Estimated savings potential</p>
              </div>
              <div className="p-2.5 bg-[#00685F] text-white rounded-xl relative z-10"><BarChart3 className="w-6 h-6" /></div>
            </div>
            <div className="flex -space-x-2 mt-4 relative z-10">
              <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 text-[8px] flex items-center justify-center font-bold text-slate-700">AT</div>
              <div className="w-6 h-6 rounded-full border-2 border-white bg-[#00685F] text-white text-[8px] flex items-center justify-center font-bold">MF</div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
