"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import TransactionsStats from "../../../components/transactions/TransactionsStats";
import TransactionsFilters from "../../../components/transactions/TransactionsFilters";
import TransactionsTable from "../../../components/transactions/TransactionsTable";
import TransactionModal from "../../../components/transactions/TransactionModal";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from "../../../services/transaction.service";
import { getCategories } from "../../../services/category.service";
import { getAccounts } from "../../../services/account.service";

// Formatter Helpers
function formatDateInput(dateStr) {
  if (!dateStr) return "";
  // The backend already sends format YYYY-MM-DD
  if (dateStr.includes("-")) {
      return dateStr.split(' ')[0]; 
  }
  return dateStr;
}

export default function TransactionsPage() {
  const [categoryIdFilter, setCategoryIdFilter] = useState("All");
  const [accountFilter, setAccountFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("Last 30 Days");
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [page, setPage] = useState(1);

  // Open/Close States for custom dropdowns
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  
  // Data State
  const [transactions, setTransactions] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState(null);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [stats, setStats] = useState({ income: 0, expense: 0, net: 0 });

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
      setPage(1);
    };
    window.addEventListener("header-search", handleHeaderSearch);
    return () => window.removeEventListener("header-search", handleHeaderSearch);
  }, []);

  // Fetch Categories and Accounts on mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const catRes = await getCategories();
        if (catRes.data) setCategories(catRes.data);

        const accRes = await getAccounts();
        if (accRes.data) setAccounts(accRes.data);
      } catch (error) {
        console.error("Error fetching categories or accounts:", error);
      }
    };
    fetchDropdownData();
  }, []);

  // Compute date range based on dateFilter
  const getDateRange = () => {
    const today = new Date();
    let start_date = null;
    let end_date = null;

    if (dateFilter === "Last 7 Days") {
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
      start_date = lastWeek.toISOString().split('T')[0];
      end_date = today.toISOString().split('T')[0];
    } else if (dateFilter === "Last 30 Days") {
      const lastMonth = new Date(today);
      lastMonth.setDate(today.getDate() - 30);
      start_date = lastMonth.toISOString().split('T')[0];
      end_date = today.toISOString().split('T')[0];
    } else if (dateFilter === "This Month") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      start_date = firstDay.toISOString().split('T')[0];
      end_date = today.toISOString().split('T')[0];
    }
    
    return { start_date, end_date };
  };

  // Fetch Transactions when filters change
  const fetchTransactionsData = async () => {
    try {
      const { start_date, end_date } = getDateRange();
      
      const res = await getTransactions({
        page,
        category_id: categoryIdFilter !== "All" ? categoryIdFilter : undefined,
        account_id: accountFilter !== "All" ? accountFilter : undefined,
        search: searchQuery || undefined,
        start_date,
        end_date
      });

      if (res.data) {
        setTransactions(res.data);
        setPaginationMeta(res.meta);
        
        // Calculate stats for current view
        let income = 0;
        let expense = 0;
        res.data.forEach(t => {
            if (t.type === 'income') income += parseFloat(t.amount);
            if (t.type === 'expense') expense += parseFloat(t.amount);
        });
        setStats({ income, expense, net: income - expense });
      }
    } catch (error) {
      toast.error("Gagal mengambil data transaksi");
    }
  };

  useEffect(() => {
    fetchTransactionsData();
  }, [page, categoryIdFilter, accountFilter, dateFilter, searchQuery]);


  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Form Field States
  const [formType, setFormType] = useState("expense");
  const [formAmount, setFormAmount] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formAccountId, setFormAccountId] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formNote, setFormNote] = useState("");

  // Action Triggers
  const openAddModal = () => {
    setModalMode("add");
    setEditingTransaction(null);
    setFormType("expense");
    setFormAmount("");
    setFormNote("");
    
    // Set default Category and Account if available
    setFormCategoryId(categories.length > 0 ? categories[0].id : "");
    setFormAccountId(accounts.length > 0 ? accounts[0].id : "");
    
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setFormDate(`${yyyy}-${mm}-${dd}`);
    
    setIsModalOpen(true);
  };

  const openEditModal = (t) => {
    setModalMode("edit");
    setEditingTransaction(t);
    setFormType(t.type);
    setFormAmount(String(Math.abs(t.amount)));
    setFormCategoryId(t.category_id);
    setFormAccountId(t.account_id);
    setFormDate(formatDateInput(t.transaction_date));
    setFormNote(t.description || "");
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      try {
        await deleteTransaction(id);
        toast.success("Transaksi berhasil dihapus!");
        fetchTransactionsData();
      } catch (error) {
        toast.error("Gagal menghapus transaksi.");
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(formAmount.replace(/\D/g, ''));
    if (isNaN(amt) || amt <= 0) {
      toast.error("Jumlah transaksi harus angka positif!");
      return;
    }

    if (!formCategoryId) {
        toast.error("Silakan pilih kategori");
        return;
    }
    
    if (!formAccountId) {
        toast.error("Silakan pilih rekening");
        return;
    }

    const payload = {
        account_id: formAccountId,
        category_id: formCategoryId,
        type: formType,
        amount: amt,
        description: formNote,
        transaction_date: formDate
    };

    try {
        if (modalMode === "add") {
            await createTransaction(payload);
            toast.success("Transaksi berhasil ditambahkan!");
        } else {
            await updateTransaction(editingTransaction.id, payload);
            toast.success("Transaksi berhasil diperbarui!");
        }
        setIsModalOpen(false);
        fetchTransactionsData();
    } catch (error) {
        toast.error("Terjadi kesalahan saat menyimpan transaksi.");
    }
  };

  const handleExport = () => {
    // Ideally this hits the backend /api/reports/export endpoint
    toast.success("Mengekspor data transaksi...");
  };

  const handlePageChange = (newPage) => {
      setPage(newPage);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Page Title */}
        <div className={`transition-all duration-700 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
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
          totalIncome={stats.income}
          totalExpenses={stats.expense}
          netCashFlow={stats.net}
          isVisible={isVisible}
        />

        {/* Filters Section */}
        <TransactionsFilters 
          categoryIdFilter={categoryIdFilter}
          setCategoryIdFilter={(val) => { setCategoryIdFilter(val); setPage(1); }}
          dateFilter={dateFilter}
          setDateFilter={(val) => { setDateFilter(val); setPage(1); }}
          accountIdFilter={accountFilter}
          setAccountIdFilter={(val) => { setAccountFilter(val); setPage(1); }}
          searchQuery={searchQuery}
          setSearchQuery={(val) => { setSearchQuery(val); setPage(1); }}
          handleExport={handleExport}
          isVisible={isVisible}
          isCategoryOpen={isCategoryOpen}
          setIsCategoryOpen={setIsCategoryOpen}
          isDateOpen={isDateOpen}
          setIsDateOpen={setIsDateOpen}
          isAccountOpen={isAccountOpen}
          setIsAccountOpen={setIsAccountOpen}
          categories={categories}
          accounts={accounts}
        />

        {/* Table Container */}
        <TransactionsTable 
          transactions={transactions}
          openEditModal={openEditModal}
          handleDelete={handleDelete}
          isVisible={isVisible}
          paginationMeta={paginationMeta}
          onPageChange={handlePageChange}
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
        formCategoryId={formCategoryId}
        setFormCategoryId={setFormCategoryId}
        formAccountId={formAccountId}
        setFormAccountId={setFormAccountId}
        formDate={formDate}
        setFormDate={setFormDate}
        formNote={formNote}
        setFormNote={setFormNote}
        categories={categories}
        accounts={accounts}
      />
    </DashboardLayout>
  );
}
