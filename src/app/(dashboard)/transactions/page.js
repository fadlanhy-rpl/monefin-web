"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import TransactionsStats from "../../../components/transactions/TransactionsStats";
import TransactionsFilters from "../../../components/transactions/TransactionsFilters";
import TransactionsTable from "../../../components/transactions/TransactionsTable";
import TransactionModal from "../../../components/transactions/TransactionModal";
import { 
  Banknote, 
  Utensils, 
  Car, 
  ShoppingBag, 
  TrendingUp, 
  Plus
} from "lucide-react";

// Formatter Helpers
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
        <TransactionsStats 
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          netCashFlow={netCashFlow}
          isVisible={isVisible}
        />

        {/* Filters Section */}
        <TransactionsFilters 
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          accountFilter={accountFilter}
          setAccountFilter={setAccountFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleExport={handleExport}
          isVisible={isVisible}
          isCategoryOpen={isCategoryOpen}
          setIsCategoryOpen={setIsCategoryOpen}
          isDateOpen={isDateOpen}
          setIsDateOpen={setIsDateOpen}
          isAccountOpen={isAccountOpen}
          setIsAccountOpen={setIsAccountOpen}
        />

        {/* Table Container */}
        <TransactionsTable 
          filteredTransactions={filteredTransactions}
          openEditModal={openEditModal}
          handleDelete={handleDelete}
          isVisible={isVisible}
        />

      </div>

      {/* Form Modal (Add / Edit Transaction) */}
      <TransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalMode={modalMode}
        handleFormSubmit={handleFormSubmit}
        formType={formType}
        setFormType={setFormType}
        formAmount={formAmount}
        setFormAmount={setFormAmount}
        formCategory={formCategory}
        setFormCategory={setFormCategory}
        formAccount={formAccount}
        setFormAccount={setFormAccount}
        formDate={formDate}
        setFormDate={setFormDate}
        formNote={formNote}
        setFormNote={setFormNote}
        isFormCategoryOpen={isFormCategoryOpen}
        setIsFormCategoryOpen={setIsFormCategoryOpen}
        isFormAccountOpen={isFormAccountOpen}
        setIsFormAccountOpen={setIsFormAccountOpen}
      />
    </DashboardLayout>
  );
}
