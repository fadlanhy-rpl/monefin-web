"use client";

import { useState, useEffect } from "react";
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
  X,
  CreditCard,
  Building,
  ChevronDown,
  Check
} from "lucide-react";

// Formatter Helpers
function formatRupiah(n) {
  const abs = Math.abs(n).toLocaleString('id-ID');
  return (n < 0 ? '- ' : '+ ') + 'Rp ' + abs;
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    return dateStr;
  }
  const day = d.getDate();
  const monthName = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${monthName} ${year}`;
}

function formatDateInput(dateStr) {
  if (!dateStr) return "";
  const monthsMap = {
    "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "Mei": 4, "Jun": 5,
    "Jul": 6, "Agt": 7, "Sep": 8, "Okt": 9, "Nov": 10, "Des": 11
  };
  const parts = dateStr.split(" ");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = monthsMap[parts[1]] !== undefined ? monthsMap[parts[1]] : 0;
    const year = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  return dateStr;
}

export default function TransactionsPage() {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [accountFilter, setAccountFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("Last 30 Days");
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  // Open/Close States for custom dropdowns
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isFormCategoryOpen, setIsFormCategoryOpen] = useState(false);
  const [isFormAccountOpen, setIsFormAccountOpen] = useState(false);

  // Trigger page reveal animations on mount & register global scroll close for dropdowns
  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => {
      setIsCategoryOpen(false);
      setIsDateOpen(false);
      setIsAccountOpen(false);
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  // Listen to global header search event
  useEffect(() => {
    const handleHeaderSearch = (e) => {
      setSearchQuery(e.detail || "");
    };
    window.addEventListener("header-search", handleHeaderSearch);
    return () => window.removeEventListener("header-search", handleHeaderSearch);
  }, []);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Form Field States
  const [formType, setFormType] = useState("expense");
  const [formAmount, setFormAmount] = useState("");
  const [formCategory, setFormCategory] = useState("Food & Drink");
  const [formAccount, setFormAccount] = useState("Bank Central Asia");
  const [formDate, setFormDate] = useState("");
  const [formNote, setFormNote] = useState("");

  // Initial dynamic transactions dataset
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
    { 
      id: 6, 
      date: '19 Okt 2023', 
      category: 'Salary', 
      account: 'Bank Central Asia', 
      note: 'Freelance Mobile App Dev', 
      amount: 3000000, 
      type: 'income', 
      icon: <Banknote className="w-3 h-3" />, 
      catClass: 'bg-emerald-50 text-emerald-700' 
    },
    { 
      id: 7, 
      date: '17 Okt 2023', 
      category: 'Investment', 
      account: 'Stock Portfolio', 
      note: 'Dividend US Tech Stocks', 
      amount: 1000000, 
      type: 'income', 
      icon: <TrendingUp className="w-3 h-3" />, 
      catClass: 'bg-teal-50 text-teal-700' 
    },
    { 
      id: 8, 
      date: '16 Okt 2023', 
      category: 'Shopping', 
      account: 'Mandiri Bank', 
      note: 'Rent payment apartment', 
      amount: -3065000, 
      type: 'expense', 
      icon: <ShoppingBag className="w-3 h-3" />, 
      catClass: 'bg-orange-50 text-orange-700' 
    },
  ]);

  // Dynamic calculations
  const totalIncome = transactions.reduce((acc, t) => t.amount > 0 ? acc + t.amount : acc, 0);
  const totalExpenses = transactions.reduce((acc, t) => t.amount < 0 ? acc + Math.abs(t.amount) : acc, 0);
  const netCashFlow = totalIncome - totalExpenses;

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

  // Action Triggers
  const openAddModal = () => {
    setModalMode("add");
    setEditingTransaction(null);
    setFormType("expense");
    setFormAmount("");
    setFormCategory("Food & Drink");
    setFormAccount("Bank Central Asia");
    
    // Today's date YYYY-MM-DD
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setFormDate(`${yyyy}-${mm}-${dd}`);
    
    setFormNote("");
    setIsModalOpen(true);
  };

  const openEditModal = (t) => {
    setModalMode("edit");
    setEditingTransaction(t);
    setFormType(t.amount < 0 ? "expense" : "income");
    setFormAmount(String(Math.abs(t.amount)));
    setFormCategory(t.category);
    setFormAccount(t.account);
    setFormDate(formatDateInput(t.date));
    setFormNote(t.note);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const amt = parseInt(formAmount, 10);
    if (isNaN(amt) || amt <= 0) {
      alert("Jumlah transaksi harus angka positif!");
      return;
    }

    const finalAmount = formType === "expense" ? -Math.abs(amt) : Math.abs(amt);
    
    // Icon & styles mapping
    let icon = <Banknote className="w-3 h-3" />;
    let catClass = "bg-emerald-50 text-emerald-700";
    if (formCategory === "Food & Drink") {
      icon = <Utensils className="w-3 h-3" />;
      catClass = "bg-red-50 text-red-700";
    } else if (formCategory === "Transport") {
      icon = <Car className="w-3 h-3" />;
      catClass = "bg-blue-50 text-blue-700";
    } else if (formCategory === "Shopping") {
      icon = <ShoppingBag className="w-3 h-3" />;
      catClass = "bg-orange-50 text-orange-700";
    } else if (formCategory === "Investment") {
      icon = <TrendingUp className="w-3 h-3" style={{ color: "rgb(15, 118, 110)" }} />;
      catClass = "bg-teal-50 text-teal-700";
    }

    const formattedDate = formatDateDisplay(formDate);

    if (modalMode === "add") {
      const newTx = {
        id: Date.now(),
        date: formattedDate,
        category: formCategory,
        account: formAccount,
        note: formNote || "-",
        amount: finalAmount,
        type: formType,
        icon,
        catClass
      };
      setTransactions(prev => [newTx, ...prev]);
    } else {
      setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? {
        ...t,
        date: formattedDate,
        category: formCategory,
        account: formAccount,
        note: formNote || "-",
        amount: finalAmount,
        type: formType,
        icon,
        catClass
      } : t));
    }

    setIsModalOpen(false);
  };

  const handleExport = () => {
    alert("Mengekspor data transaksi ke format CSV...");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Page Title */}
        <div className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Transactions History</h2>
            <p className="text-gray-500 text-sm mt-1">Comprehensive record of your financial movements across all linked accounts.</p>
          </div>
          <button 
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 bg-[#00685F] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#004D46] hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95 shrink-0 relative overflow-hidden shimmer-sweep cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Add Transaction
          </button>
        </div>

        {/* Overview Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Income Card */}
          <div className={`bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden transition-all duration-700 delay-100 ease-out transform hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Income</p>
                <h3 className="text-2xl font-black text-slate-900 mt-2">Rp {totalIncome.toLocaleString('id-ID')}</h3>
                <p className="text-[10px] text-gray-400 mt-1">This current month</p>
              </div>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl transition-transform duration-300 hover:scale-110 hover:rotate-6"><Wallet className="w-6 h-6" /></div>
            </div>
            <div className="flex items-center gap-2 self-start bg-emerald-50 px-2 py-1 rounded-lg z-10">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span className="text-[10px] font-black text-emerald-600">12.5%</span>
            </div>

            {/* Sparkline graphic at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden pointer-events-none rounded-b-[2.5rem]">
              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="income-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.15"/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M 0 24 C 20 24, 35 16, 50 18 C 65 20, 80 8, 100 12" fill="none" stroke="#10b981" strokeWidth="1.5" className="sparkline-path" />
                <path d="M 0 24 C 20 24, 35 16, 50 18 C 65 20, 80 8, 100 12 L 100 30 L 0 30 Z" fill="url(#income-grad)" />
              </svg>
            </div>
          </div>

          {/* Expenses Card */}
          <div className={`bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden transition-all duration-700 delay-200 ease-out transform hover:-translate-y-1 hover:shadow-xl hover:shadow-red-500/5 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Expenses</p>
                <h3 className="text-2xl font-black text-slate-900 mt-2">Rp {totalExpenses.toLocaleString('id-ID')}</h3>
                <p className="text-[10px] text-gray-400 mt-1">This current month</p>
              </div>
              <div className="p-2.5 bg-red-50 text-red-600 rounded-xl transition-transform duration-300 hover:scale-110 hover:-rotate-6"><ShoppingCart className="w-6 h-6" /></div>
            </div>
            <div className="flex items-center gap-2 self-start bg-red-50 px-2 py-1 rounded-lg z-10">
              <TrendingDown className="w-3 h-3 text-red-600" />
              <span className="text-[10px] font-black text-red-600">3.2%</span>
            </div>

            {/* Sparkline graphic at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden pointer-events-none rounded-b-[2.5rem]">
              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="expense-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.15"/>
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M 0 8 C 20 8, 35 18, 50 16 C 65 14, 80 24, 100 20" fill="none" stroke="#ef4444" strokeWidth="1.5" className="sparkline-path" />
                <path d="M 0 8 C 20 8, 35 18, 50 16 C 65 14, 80 24, 100 20 L 100 30 L 0 30 Z" fill="url(#expense-grad)" />
              </svg>
            </div>
          </div>

          {/* Net Cash Card */}
          <div className={`bg-[#E6F0EF]/60 p-6 rounded-[2.5rem] border border-[#c0ded9]/50 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden transition-all duration-700 delay-300 ease-out transform hover:-translate-y-1 hover:shadow-xl hover:shadow-[#00685F]/5 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="flex justify-between items-start">
              <div className="relative z-10">
                <p className="text-[10px] font-black text-[#00685F] uppercase tracking-widest">Net Cash Flow</p>
                <h3 className="text-2xl font-black text-slate-900 mt-2">Rp {netCashFlow.toLocaleString('id-ID')}</h3>
                <p className="text-[10px] text-[#00685F]/60 mt-1">Estimated savings potential</p>
              </div>
              <div className="p-2.5 bg-[#00685F] text-white rounded-xl relative z-10 transition-transform duration-300 hover:scale-110 hover:rotate-6"><BarChart3 className="w-6 h-6" /></div>
            </div>
            <div className="flex -space-x-2 mt-4 relative z-10">
              <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 text-[8px] flex items-center justify-center font-bold text-slate-700 transition-transform duration-300 hover:scale-110">AT</div>
              <div className="w-6 h-6 rounded-full border-2 border-white bg-[#00685F] text-white text-[8px] flex items-center justify-center font-bold transition-transform duration-300 hover:scale-110">MF</div>
            </div>

            {/* Sparkline graphic at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden pointer-events-none rounded-b-[2.5rem]">
              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="net-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00685F" stopOpacity="0.15"/>
                    <stop offset="100%" stopColor="#00685F" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M 0 20 C 20 20, 35 24, 50 16 C 65 8, 80 6, 100 8" fill="none" stroke="#00685F" strokeWidth="1.5" className="sparkline-path" />
                <path d="M 0 20 C 20 20, 35 24, 50 16 C 65 8, 80 6, 100 8 L 100 30 L 0 30 Z" fill="url(#net-grad)" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className={`bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap items-center gap-3 transition-all duration-700 delay-400 ease-out transform relative z-20 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Filters</span>
          
          <div 
            onScroll={() => {
              setIsCategoryOpen(false);
              setIsDateOpen(false);
              setIsAccountOpen(false);
            }}
            className="flex flex-nowrap gap-2 overflow-x-auto pb-2 -mb-2 flex-1 relative z-30 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {/* Category Filter */}
            <div className="relative shrink-0">
              <button 
                type="button"
                onClick={() => {
                  setIsCategoryOpen(!isCategoryOpen);
                  setIsDateOpen(false);
                  setIsAccountOpen(false);
                }}
                className="flex items-center justify-between gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all select-none cursor-pointer min-w-[130px]"
              >
                <span>Category: {categoryFilter === "All" ? "All" : categoryFilter}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCategoryOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setIsCategoryOpen(false)} />
                  <div className="dropdown-pop fixed mt-1.5 bg-white border border-slate-100 rounded-2xl shadow-xl z-30 py-1.5 min-w-[180px] overflow-hidden">
                    {['All', 'Salary', 'Food & Drink', 'Transport', 'Shopping', 'Investment'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setCategoryFilter(cat);
                          setIsCategoryOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors flex items-center justify-between ${
                          categoryFilter === cat 
                            ? 'bg-brand-50 text-brand-700' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span>{cat === 'All' ? 'All Categories' : cat}</span>
                        {categoryFilter === cat && <Check className="w-3.5 h-3.5 text-brand-600" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Date Filter */}
            <div className="relative shrink-0">
              <button 
                type="button"
                onClick={() => {
                  setIsDateOpen(!isDateOpen);
                  setIsCategoryOpen(false);
                  setIsAccountOpen(false);
                }}
                className="flex items-center justify-between gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all select-none cursor-pointer min-w-[140px]"
              >
                <span>Date: {dateFilter}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isDateOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDateOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setIsDateOpen(false)} />
                  <div className="dropdown-pop fixed mt-1.5 bg-white border border-slate-100 rounded-2xl shadow-xl z-30 py-1.5 min-w-[180px] overflow-hidden">
                    {['Last 30 Days', 'This Month', 'Last 7 Days'].map((dateOpt) => (
                      <button
                        key={dateOpt}
                        type="button"
                        onClick={() => {
                          setDateFilter(dateOpt);
                          setIsDateOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors flex items-center justify-between ${
                          dateFilter === dateOpt 
                            ? 'bg-brand-50 text-brand-700' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span>{dateOpt}</span>
                        {dateFilter === dateOpt && <Check className="w-3.5 h-3.5 text-brand-600" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Account Filter */}
            <div className="relative shrink-0">
              <button 
                type="button"
                onClick={() => {
                  setIsAccountOpen(!isAccountOpen);
                  setIsCategoryOpen(false);
                  setIsDateOpen(false);
                }}
                className="flex items-center justify-between gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all select-none cursor-pointer min-w-[160px]"
              >
                <span>Account: {accountFilter === 'All' ? 'All' : accountFilter}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isAccountOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isAccountOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setIsAccountOpen(false)} />
                  <div className="dropdown-pop fixed mt-1.5 bg-white border border-slate-100 rounded-2xl shadow-xl z-30 py-1.5 min-w-[200px] overflow-hidden">
                    {['All', 'Bank Central Asia', 'GoPay Wallet', 'Mandiri Bank', 'Credit Card', 'Stock Portfolio'].map((acc) => (
                      <button
                        key={acc}
                        type="button"
                        onClick={() => {
                          setAccountFilter(acc);
                          setIsAccountOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors flex items-center justify-between ${
                          accountFilter === acc 
                            ? 'bg-brand-50 text-brand-700' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span>{acc === 'All' ? 'All Accounts' : acc}</span>
                        {accountFilter === acc && <Check className="w-3.5 h-3.5 text-brand-600" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-xs w-full focus:ring-1 focus:ring-[#00685F] focus:bg-white outline-none text-slate-600 transition-all" 
                placeholder="Search transactions..."
              />
            </div>
            <button 
              onClick={handleExport}
              title="Export CSV"
              className="p-2 border border-slate-100 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all active:scale-95 hover:scale-105"
            >
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 border border-slate-100 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all active:scale-95 hover:scale-105">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className={`bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-all duration-700 delay-500 ease-out transform relative z-10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-slate-50/50 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                <tr>
                  <th className="px-6 py-5">Date</th>
                  <th className="px-6 py-5">Category</th>
                  <th className="px-6 py-5">Account</th>
                  <th className="px-6 py-5">Note</th>
                  <th className="px-6 py-5 text-right">Amount</th>
                  <th className="px-6 py-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t) => {
                    const isExpense = t.amount < 0;
                    const amountText = formatRupiah(t.amount);
                    const amountClass = isExpense ? "text-red-600 font-extrabold" : "text-emerald-600 font-extrabold";

                    return (
                      <tr key={t.id} className="txn-row border-b border-slate-100/60 hover:bg-[#f4faf9] transition-all duration-200 group">
                        <td className="px-6 py-4 text-gray-500 font-semibold whitespace-nowrap">{t.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-300 hover:scale-105 ${t.catClass}`}>
                            {t.icon}
                            {t.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-800 text-xs whitespace-nowrap">{t.account}</td>
                        <td className="px-6 py-4 text-gray-400 text-xs max-w-xs truncate font-medium" title={t.note}>
                          {t.note}
                        </td>
                        <td className={`px-6 py-4 text-right whitespace-nowrap font-mono tracking-tight ${amountClass}`}>{amountText}</td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <div className="flex justify-center gap-2 text-slate-300 group-hover:text-slate-400 transition-colors">
                            <button 
                              onClick={() => openEditModal(t)}
                              title="Edit Transaksi"
                              className="hover:text-[#00685F] transition-all p-1 hover:bg-slate-100 rounded-lg active:scale-95 hover:scale-110 duration-200 hover:rotate-6"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(t.id)}
                              title="Hapus Transaksi"
                              className="hover:text-red-500 transition-all p-1 hover:bg-slate-100 rounded-lg active:scale-95 hover:scale-110 duration-200 hover:-rotate-6"
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
                    <td colSpan="6" className="py-14 text-center text-sm font-bold text-slate-400">
                      Tidak ada transaksi yang cocok dengan pencarian / filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-5 bg-white border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 font-semibold text-center">
              Showing <span className="text-slate-900 font-extrabold">1-{filteredTransactions.length}</span> of <span className="text-slate-900 font-extrabold">{filteredTransactions.length}</span> transactions
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 text-xs border border-gray-100 rounded-xl font-bold text-gray-300 cursor-not-allowed select-none">&lt; Previous</button>
              <div className="flex gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#00685F] text-white text-xs font-bold shadow-sm shadow-[#00685F]/20">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-xs font-bold text-slate-500 hover:text-slate-800 transition-all">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-xs font-bold text-slate-500 hover:text-slate-800 transition-all">3</button>
                <span className="text-gray-300 px-1 select-none">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-xs font-bold text-slate-500 hover:text-slate-800 transition-all">13</button>
              </div>
              <button className="px-3 py-2 text-xs border border-gray-100 rounded-xl font-bold hover:bg-slate-50 text-slate-600 transition-all active:scale-95">Next &gt;</button>
            </div>
          </div>
        </div>

      </div>

      {/* Form Modal (Add / Edit Transaction) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900">
                {modalMode === "add" ? "Add Transaction" : "Edit Transaction"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {/* Type Switcher */}
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setFormType("income")}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${formType === "income" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                >
                  Pemasukan (Income)
                </button>
                <button
                  type="button"
                  onClick={() => setFormType("expense")}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${formType === "expense" ? "bg-white text-red-500 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                >
                  Pengeluaran (Expense)
                </button>
              </div>

              {/* Amount */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Jumlah (Amount)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center font-black text-slate-400">Rp</span>
                  <input
                    type="number"
                    required
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-black text-slate-800"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5 relative">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori (Category)</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsFormCategoryOpen(!isFormCategoryOpen);
                    setIsFormAccountOpen(false);
                  }}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-left flex items-center justify-between text-sm text-slate-600 font-bold cursor-pointer relative z-30"
                >
                  <span>{formCategory}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isFormCategoryOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isFormCategoryOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setIsFormCategoryOpen(false)} />
                    <div className="dropdown-pop absolute left-0 right-0 mt-1.5 bg-white border border-slate-100 rounded-2xl shadow-xl z-30 py-1.5 max-h-52 overflow-y-auto">
                      {['Salary', 'Food & Drink', 'Transport', 'Shopping', 'Investment'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setFormCategory(cat);
                            setIsFormCategoryOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors flex items-center justify-between ${
                            formCategory === cat 
                              ? 'bg-brand-50 text-brand-700' 
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span>{cat}</span>
                          {formCategory === cat && <Check className="w-3.5 h-3.5 text-brand-600" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Account */}
              <div className="space-y-1.5 relative">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rekening (Account)</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsFormAccountOpen(!isFormAccountOpen);
                    setIsFormCategoryOpen(false);
                  }}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-left flex items-center justify-between text-sm text-slate-600 font-bold cursor-pointer relative z-30"
                >
                  <span>{formAccount}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isFormAccountOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isFormAccountOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setIsFormAccountOpen(false)} />
                    <div className="dropdown-pop absolute left-0 right-0 mt-1.5 bg-white border border-slate-100 rounded-2xl shadow-xl z-30 py-1.5 max-h-52 overflow-y-auto">
                      {['Bank Central Asia', 'GoPay Wallet', 'Mandiri Bank', 'Credit Card', 'Stock Portfolio'].map((acc) => (
                        <button
                          key={acc}
                          type="button"
                          onClick={() => {
                            setFormAccount(acc);
                            setIsFormAccountOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors flex items-center justify-between ${
                            formAccount === acc 
                              ? 'bg-brand-50 text-brand-700' 
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span>{acc}</span>
                          {formAccount === acc && <Check className="w-3.5 h-3.5 text-brand-600" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tanggal (Date)</label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm text-slate-600 font-bold cursor-pointer"
                />
              </div>

              {/* Note */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Catatan (Note)</label>
                <input
                  type="text"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm text-slate-600 font-semibold"
                  placeholder="Keterangan transaksi..."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-[#00685F] text-white rounded-2xl font-bold text-sm hover:bg-[#004D46] hover:shadow-lg transition-all active:scale-95"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
