"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import TransactionsStats from "../../../components/transactions/TransactionsStats";
import TransactionsFilters from "../../../components/transactions/TransactionsFilters";
import TransactionsTable from "../../../components/transactions/TransactionsTable";
import TransactionModal from "../../../components/transactions/TransactionModal";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { Plus, Search, X } from "lucide-react";
import toast from "react-hot-toast";
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from "../../../services/transaction.service";
import { getCategories } from "../../../services/category.service";
import { getAccounts } from "../../../services/account.service";
import { formatDate } from "../../../lib/utils";
import { useLanguage } from "../../../context/LanguageContext";
import { useCurrency } from "../../../hooks/useCurrency";

// Formatter Helpers
function formatDateInput(dateStr) {
  if (!dateStr) return "";
  // The backend already sends format YYYY-MM-DD
  if (dateStr.includes("-")) {
      return dateStr.split(' ')[0]; 
  }
  return dateStr;
}

function TransactionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();
  const { formatCurrency, currencyCode } = useCurrency();

  const [categoryIdFilter, setCategoryIdFilter] = useState("All");
  const [accountFilter, setAccountFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("last_30_days");
  // Inisialisasi dari URL param ?search= (dari header search navbar)
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") || "");
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

  // Listen to searchParams updates (from header or URL navigation)
  useEffect(() => {
    const q = searchParams.get("search");
    if (q !== null && q !== undefined) {
      setSearchQuery(q);
      if (q.trim()) {
        setDateFilter("all_time");
      }
      setPage(1);
    }
  }, [searchParams]);

  // Listen to global header search event
  useEffect(() => {
    const handleHeaderSearch = (e) => {
      setSearchQuery(e.detail || "");
      if (e.detail && e.detail.trim()) {
        setDateFilter("all_time");
      }
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
        if (error?.status !== 401) {
          console.error("Error fetching categories or accounts:", error.message || error);
        }
      }
    };
    fetchDropdownData();
  }, []);

  // Compute date range based on dateFilter
  const getDateRange = () => {
    const today = new Date();
    let start_date = null;
    let end_date = null;

    if (dateFilter === "last_7_days") {
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
      start_date = lastWeek.toISOString().split('T')[0];
      end_date = today.toISOString().split('T')[0];
    } else if (dateFilter === "last_30_days") {
      const lastMonth = new Date(today);
      lastMonth.setDate(today.getDate() - 30);
      start_date = lastMonth.toISOString().split('T')[0];
      end_date = today.toISOString().split('T')[0];
    } else if (dateFilter === "this_month") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      start_date = firstDay.toISOString().split('T')[0];
      end_date = today.toISOString().split('T')[0];
    } else if (dateFilter === "this_year") {
      const firstDay = new Date(today.getFullYear(), 0, 1);
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
      toast.error(language === "en" ? "Failed to fetch transaction data" : "Gagal mengambil data transaksi");
    }
  };

  useEffect(() => {
    fetchTransactionsData();
  }, [page, categoryIdFilter, accountFilter, dateFilter, searchQuery]);


  // Modal & Confirm States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      await deleteTransaction(deletingId);
      toast.success(language === "en" ? "Transaction successfully deleted!" : "Transaksi berhasil dihapus!");
      fetchTransactionsData();
    } catch (error) {
      toast.error(language === "en" ? "Failed to delete transaction." : "Gagal menghapus transaksi.");
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setDeletingId(null);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(formAmount.replace(/\D/g, ''));
    if (isNaN(amt) || amt <= 0) {
      toast.error(language === "en" ? "Transaction amount must be a positive number!" : "Jumlah transaksi harus angka positif!");
      return;
    }

    if (!formCategoryId) {
        toast.error(language === "en" ? "Please select a category" : "Silakan pilih kategori");
        return;
    }
    
    if (!formAccountId) {
        toast.error(language === "en" ? "Please select an account" : "Silakan pilih rekening");
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
            toast.success(language === "en" ? "Transaction successfully added!" : "Transaksi berhasil ditambahkan!");
        } else {
            await updateTransaction(editingTransaction.id, payload);
            toast.success(language === "en" ? "Transaction successfully updated!" : "Transaksi berhasil diperbarui!");
        }
        setIsModalOpen(false);
        fetchTransactionsData();
    } catch (error) {
        toast.error(language === "en" ? "An error occurred while saving the transaction." : "Terjadi kesalahan saat menyimpan transaksi.");
    }
  };

  const handleExport = () => {
    if (!transactions || transactions.length === 0) {
      toast.error(language === "en" ? "No transaction data to export!" : "Tidak ada data transaksi untuk diekspor!");
      return;
    }

    const sep = ";";

    // Hitung total untuk ringkasan akuntansi
    let totalIncome = 0;
    let totalExpense = 0;
    transactions.forEach(t => {
      const amt = Math.abs(parseFloat(t.amount) || 0);
      if (t.type === 'income') totalIncome += amt;
      if (t.type === 'expense') totalExpense += amt;
    });
    const netCashflow = totalIncome - totalExpense;

    const formatCurrencyNum = (num) => {
      if (!num || num === 0) return formatCurrency(0);
      return formatCurrency(num);
    };

    const nowStr = new Date().toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + " WIB";

    // Menghitung statistik per kategori
    const categoryStats = {};
    transactions.forEach(t => {
      const catName = t.category?.name || "Lainnya";
      const amt = parseFloat(t.amount) || 0;
      if (!categoryStats[catName]) {
        categoryStats[catName] = { income: 0, expense: 0, count: 0 };
      }
      categoryStats[catName].count += 1;
      if (t.type === 'income') categoryStats[catName].income += amt;
      if (t.type === 'expense') categoryStats[catName].expense += Math.abs(amt);
    });

    const categoryStatsRows = [
      "",
      `"STATISTIK PER KATEGORI"`,
      `"Kategori"${sep}"Jml Transaksi"${sep}"Total Pemasukan (${currencyCode})"${sep}"Total Pengeluaran (${currencyCode})"`
    ];
    Object.keys(categoryStats).sort().forEach(cat => {
      const stats = categoryStats[cat];
      categoryStatsRows.push(
        `"${cat}"${sep}"${stats.count}"${sep}"${formatCurrencyNum(stats.income)}"${sep}"${formatCurrencyNum(stats.expense)}"`
      );
    });

    // Header Metadata Laporan Akuntan
    const reportMetadata = [
      "sep=" + sep,
      `"LAPORAN MUTASI DAN RIWAYAT TRANSAKSI - MONEFIN"`,
      "",
      `"INFORMASI LAPORAN"`,
      `"Tanggal Cetak"${sep}"${nowStr}"`,
      `"Total Record"${sep}"${transactions.length} Transaksi"`,
      "",
      `"RINGKASAN KEUANGAN"`,
      `"Total Pemasukan"${sep}"${formatCurrencyNum(totalIncome)}"`,
      `"Total Pengeluaran"${sep}"${formatCurrencyNum(totalExpense)}"`,
      `"Net Cashflow"${sep}"${netCashflow >= 0 ? '+' : '-'}${formatCurrencyNum(Math.abs(netCashflow))}"`
    ];

    // Header Tabel
    const headers = [
      "No.",
      "Tanggal",
      "Tipe Transaksi",
      "Kategori",
      "Akun / Sumber Dana",
      "Keterangan / Catatan",
      "Pemasukan",
      "Pengeluaran",
      "Nominal Net"
    ];

    // Data Baris Transaksi
    const dataRows = transactions.map((t, idx) => {
      const isExpense = t.type === 'expense';
      const amt = Math.abs(parseFloat(t.amount) || 0);
      const dateFormatted = formatDate(t.transaction_date);
      const categoryName = t.category?.name || "Lainnya";
      const accountName = t.account?.name || "Utama";
      const noteClean = (t.description || "-").replace(/"/g, '""');
      const typeLabel = isExpense ? "Pengeluaran" : "Pemasukan";

      const incomeVal = !isExpense ? formatCurrencyNum(amt) : "-";
      const expenseVal = isExpense ? formatCurrencyNum(amt) : "-";
      const netVal = (isExpense ? "- " : "+ ") + formatCurrencyNum(amt);

      return [
        idx + 1,
        `"${dateFormatted}"`,
        `"${typeLabel}"`,
        `"${categoryName}"`,
        `"${accountName}"`,
        `"${noteClean}"`,
        `"${incomeVal}"`,
        `"${expenseVal}"`,
        `"${netVal}"`
      ].join(sep);
    });

    // Baris Total Rekapitulasi Akuntansi
    const summaryRow = [
      `"TOTAL REKAPITULASI"`,
      "",
      "",
      "",
      "",
      "",
      `"${formatCurrencyNum(totalIncome)}"`,
      `"${formatCurrencyNum(totalExpense)}"`,
      `"${netCashflow >= 0 ? '+' : '-'}${formatCurrencyNum(Math.abs(netCashflow))}"`
    ].join(sep);

    const fullCsvContent = "\uFEFF" + [
      ...reportMetadata,
      ...categoryStatsRows,
      "",
      `"RINCIAN TRANSAKSI"`,
      headers.join(sep),
      ...dataRows,
      "",
      summaryRow
    ].join("\n");

    const blob = new Blob([fullCsvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    const todayStr = new Date().toISOString().split("T")[0];
    link.setAttribute("download", `Laporan_Transaksi_MoneFin_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Berhasil mengunduh Laporan Transaksi (${transactions.length} data)!`);
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
            <h2 className="text-2xl font-extrabold text-slate-900">{t("transactions.title") || "Transactions History"}</h2>
            <p className="text-gray-500 text-sm mt-1">{t("transactions.subtitle") || "Comprehensive record of your financial movements across all linked accounts."}</p>
          </div>
          <button 
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 bg-[#00685F] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#004D46] hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95 shrink-0 relative overflow-hidden shimmer-sweep cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            {t("transactions.add_transaction") || "Add Transaction"}
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

        {/* Active Search Banner */}
        {searchQuery && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-brand-50/70 border border-brand-200/80 px-4 py-3 rounded-2xl text-xs text-brand-900 shadow-xs animate-fadeIn">
            <div className="flex items-center gap-2 min-w-0">
              <Search className="w-4 h-4 text-brand-600 shrink-0" />
              <span className="truncate">
                {language === 'en' ? 'Showing search result for:' : 'Menampilkan hasil pencarian untuk:'}{' '}
                <span className="font-bold text-slate-900">"{searchQuery}"</span>
              </span>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setDateFilter("last_30_days");
                router.replace("/transactions");
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-brand-100/60 text-brand-700 hover:text-brand-900 font-bold rounded-xl border border-brand-200 transition-all text-xs shrink-0 cursor-pointer shadow-xs active:scale-95"
            >
              <X className="w-3.5 h-3.5" />
              {language === 'en' ? 'Show All Transactions' : 'Tampilkan Semua Transaksi'}
            </button>
          </div>
        )}

        {/* Table Container */}
        <TransactionsTable 
          transactions={transactions}
          openEditModal={openEditModal}
          handleDelete={handleDeleteClick}
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

      {/* Modern Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Transaksi ini?"
        message="Apakah Anda yakin ingin menghapus catatan transaksi ini? Saldo pada rekening Anda akan secara otomatis disesuaikan."
        confirmText="Ya, Hapus"
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
}

export default function TransactionsPageWrapper() {
  return (
    <Suspense fallback={null}>
      <TransactionsPage />
    </Suspense>
  );
}
