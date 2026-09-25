"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { 
  getTransactions, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction 
} from "../../../services/transaction.service";
import { getCategories } from "../../../services/category.service";
import { getAccounts } from "../../../services/account.service";
import { useLanguage } from "../../../context/LanguageContext";
import { useCurrency } from "../../../hooks/useCurrency";
import { formatDate } from "../../../lib/utils";

function formatDateInput(dateStr) {
  if (!dateStr) return "";
  if (dateStr.includes("-")) {
    return dateStr.split(" ")[0];
  }
  return dateStr;
}

export function useTransactionsPage() {
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();
  const { formatCurrency, currencyCode } = useCurrency();

  const [categoryIdFilter, setCategoryIdFilter] = useState("All");
  const [accountFilter, setAccountFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("last_30_days");
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") || "");
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

  // Modal & Confirm States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Field States
  const [formType, setFormType] = useState("expense");
  const [formAmount, setFormAmount] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formAccountId, setFormAccountId] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formNote, setFormNote] = useState("");

  const isVisible = true;

  // Register global scroll close for dropdowns
  useEffect(() => {
    const handleScroll = () => {
      setIsCategoryOpen(false);
      setIsDateOpen(false);
      setIsAccountOpen(false);
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  // Listen to searchParams updates (from header or URL navigation)
  const urlSearch = searchParams.get("search");
  useEffect(() => {
    if (urlSearch !== null && urlSearch !== undefined) {
      const timer = setTimeout(() => {
        setSearchQuery(urlSearch);
        if (urlSearch.trim()) {
          setDateFilter("all_time");
        }
        setPage(1);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [urlSearch]);

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
    let ignore = false;
    const fetchDropdownData = async () => {
      try {
        const [catRes, accRes] = await Promise.all([
          getCategories(),
          getAccounts(),
        ]);
        if (!ignore) {
          if (catRes.data) setCategories(catRes.data);
          if (accRes.data) setAccounts(accRes.data);
        }
      } catch (error) {
        if (!ignore && error?.status !== 401) {
          console.error("Error fetching categories or accounts:", error.message || error);
        }
      }
    };
    fetchDropdownData();
    return () => {
      ignore = true;
    };
  }, []);

  // Compute date range based on dateFilter
  const getDateRange = useCallback(() => {
    const today = new Date();
    let start_date = null;
    let end_date = null;

    if (dateFilter === "last_7_days") {
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
      start_date = lastWeek.toISOString().split("T")[0];
      end_date = today.toISOString().split("T")[0];
    } else if (dateFilter === "last_30_days") {
      const lastMonth = new Date(today);
      lastMonth.setDate(today.getDate() - 30);
      start_date = lastMonth.toISOString().split("T")[0];
      end_date = today.toISOString().split("T")[0];
    } else if (dateFilter === "this_month") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      start_date = firstDay.toISOString().split("T")[0];
      end_date = today.toISOString().split("T")[0];
    } else if (dateFilter === "this_year") {
      const firstDay = new Date(today.getFullYear(), 0, 1);
      start_date = firstDay.toISOString().split("T")[0];
      end_date = today.toISOString().split("T")[0];
    }
    
    return { start_date, end_date };
  }, [dateFilter]);

  // Fetch Transactions when filters change
  const fetchTransactionsData = useCallback(async (force = false) => {
    try {
      const { start_date, end_date } = getDateRange();
      
      const res = await getTransactions({
        page,
        category_id: categoryIdFilter !== "All" ? categoryIdFilter : undefined,
        account_id: accountFilter !== "All" ? accountFilter : undefined,
        search: searchQuery || undefined,
        start_date,
        end_date,
      }, force); // pass force flag to bypass cache when called after mutation

      if (res.data) {
        setTransactions(res.data);
        setPaginationMeta(res.meta);
        
        if (res.summary) {
          const income = parseFloat(res.summary.income) || 0;
          const expense = parseFloat(res.summary.expense) || 0;
          setStats({ income, expense, net: income - expense });
        } else {
          let income = 0;
          let expense = 0;
          res.data.forEach((t) => {
            if (t.type === "income") income += parseFloat(t.amount);
            if (t.type === "expense") expense += parseFloat(t.amount);
          });
          setStats({ income, expense, net: income - expense });
        }
      }
    } catch {
      toast.error(language === "en" ? "Failed to fetch transaction data" : "Gagal mengambil data transaksi");
    }
  }, [getDateRange, page, categoryIdFilter, accountFilter, searchQuery, language]);


  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const { start_date, end_date } = getDateRange();
        const res = await getTransactions({
          page,
          category_id: categoryIdFilter !== "All" ? categoryIdFilter : undefined,
          account_id: accountFilter !== "All" ? accountFilter : undefined,
          search: searchQuery || undefined,
          start_date,
          end_date,
        });

        if (!ignore && res.data) {
          setTransactions(res.data);
          setPaginationMeta(res.meta);
          
          if (res.summary) {
            const income = parseFloat(res.summary.income) || 0;
            const expense = parseFloat(res.summary.expense) || 0;
            setStats({ income, expense, net: income - expense });
          } else {
            let income = 0;
            let expense = 0;
            res.data.forEach((t) => {
              if (t.type === "income") income += parseFloat(t.amount);
              if (t.type === "expense") expense += parseFloat(t.amount);
            });
            setStats({ income, expense, net: income - expense });
          }
        }
      } catch {
        if (!ignore) {
          toast.error(language === "en" ? "Failed to fetch transaction data" : "Gagal mengambil data transaksi");
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [getDateRange, page, categoryIdFilter, accountFilter, searchQuery, language]);

  // Action Triggers
  const openAddModal = (initialType = "expense") => {
    setModalMode("add");
    setEditingTransaction(null);
    setFormType(initialType === "income" ? "income" : "expense");
    setFormAmount("");
    setFormNote("");
    
    setFormCategoryId(categories.length > 0 ? categories[0].id : "");
    setFormAccountId(accounts.length > 0 ? accounts[0].id : "");
    
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
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

  const closeAddEditModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmOpen(false);
    setDeletingId(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      await deleteTransaction(deletingId);
      toast.success(language === "en" ? "Transaction successfully deleted!" : "Transaksi berhasil dihapus!");
      fetchTransactionsData(true); // bypass cache after delete
    } catch {
      toast.error(language === "en" ? "Failed to delete transaction." : "Gagal menghapus transaksi.");
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setDeletingId(null);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const amt = parseFloat(formAmount.replace(/\D/g, ""));
    if (isNaN(amt) || amt <= 0) {
      toast.error(language === "en" ? "Transaction amount must be a positive number!" : "Jumlah transaksi harus angka positif!");
      return;
    }

    if (!formCategoryId) {
      toast.error(language === "en" ? "Please select a category!" : "Silakan pilih kategori!");
      return;
    }

    if (!formAccountId) {
      toast.error(language === "en" ? "Please select an account!" : "Silakan pilih rekening!");
      return;
    }

    if (!formDate) {
      toast.error(language === "en" ? "Transaction date is required!" : "Tanggal transaksi wajib diisi!");
      return;
    }

    const payload = {
      type: formType,
      amount: amt,
      category_id: formCategoryId,
      account_id: formAccountId,
      transaction_date: formDate,
      description: formNote || undefined,
    };

    try {
      setIsSubmitting(true);
      if (modalMode === "add") {
        await createTransaction(payload);
        toast.success(language === "en" ? "Transaction successfully added!" : "Transaksi berhasil ditambahkan!");
      } else {
        await updateTransaction(editingTransaction.id, payload);
        toast.success(language === "en" ? "Transaction successfully updated!" : "Transaksi berhasil diperbarui!");
      }
      setIsModalOpen(false);
      fetchTransactionsData(true); // bypass cache after create/update
    } catch (error) {
      toast.error(error.message || (language === "en" ? "Failed to save transaction." : "Gagal menyimpan transaksi."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = () => {
    if (!transactions || transactions.length === 0) {
      toast.error(language === "en" ? "No transaction data to export!" : "Tidak ada data transaksi untuk diekspor!");
      return;
    }

    const sep = ";";

    let totalIncome = 0;
    let totalExpense = 0;
    transactions.forEach((t) => {
      const amt = Math.abs(parseFloat(t.amount) || 0);
      if (t.type === "income") totalIncome += amt;
      if (t.type === "expense") totalExpense += amt;
    });
    const netCashflow = totalIncome - totalExpense;

    const formatCurrencyNum = (num) => {
      if (!num || num === 0) return formatCurrency(0);
      return formatCurrency(num);
    };

    const nowStr = new Date().toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB";

    const categoryStats = {};
    transactions.forEach((t) => {
      const catName = t.category?.name || "Lainnya";
      const amt = parseFloat(t.amount) || 0;
      if (!categoryStats[catName]) {
        categoryStats[catName] = { income: 0, expense: 0, count: 0 };
      }
      categoryStats[catName].count += 1;
      if (t.type === "income") categoryStats[catName].income += amt;
      if (t.type === "expense") categoryStats[catName].expense += Math.abs(amt);
    });

    const categoryStatsRows = [
      "",
      `"STATISTIK PER KATEGORI"`,
      `"Kategori"${sep}"Jml Transaksi"${sep}"Total Pemasukan (${currencyCode})"${sep}"Total Pengeluaran (${currencyCode})"`,
    ];
    Object.keys(categoryStats).sort().forEach((cat) => {
      const catStat = categoryStats[cat];
      categoryStatsRows.push(
        `"${cat}"${sep}"${catStat.count}"${sep}"${formatCurrencyNum(catStat.income)}"${sep}"${formatCurrencyNum(catStat.expense)}"`
      );
    });

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
      `"Net Cashflow"${sep}"${netCashflow >= 0 ? "+" : "-"}${formatCurrencyNum(Math.abs(netCashflow))}"`,
    ];

    const headers = [
      "No.",
      "Tanggal",
      "Tipe Transaksi",
      "Kategori",
      "Akun / Sumber Dana",
      "Keterangan / Catatan",
      "Pemasukan",
      "Pengeluaran",
      "Nominal Net",
    ];

    const dataRows = transactions.map((t, idx) => {
      const isExpense = t.type === "expense";
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
        `"${netVal}"`,
      ].join(sep);
    });

    const summaryRow = [
      `"TOTAL REKAPITULASI"`,
      "",
      "",
      "",
      "",
      "",
      `"${formatCurrencyNum(totalIncome)}"`,
      `"${formatCurrencyNum(totalExpense)}"`,
      `"${netCashflow >= 0 ? "+" : "-"}${formatCurrencyNum(Math.abs(netCashflow))}"`,
    ].join(sep);

    const fullCsvContent = "\uFEFF" + [
      ...reportMetadata,
      ...categoryStatsRows,
      "",
      `"RINCIAN TRANSAKSI"`,
      headers.join(sep),
      ...dataRows,
      "",
      summaryRow,
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

  return {
    t,
    language,
    categoryIdFilter,
    setCategoryIdFilter,
    accountFilter,
    setAccountFilter,
    dateFilter,
    setDateFilter,
    searchQuery,
    setSearchQuery,
    handleExport,
    isVisible,
    page,
    setPage,
    isCategoryOpen,
    setIsCategoryOpen,
    isDateOpen,
    setIsDateOpen,
    isAccountOpen,
    setIsAccountOpen,
    transactions,
    paginationMeta,
    categories,
    accounts,
    stats,
    isModalOpen,
    modalMode,
    openAddModal,
    openEditModal,
    closeAddEditModal,
    isConfirmOpen,
    isDeleting,
    handleDeleteClick,
    closeConfirmModal,
    handleConfirmDelete,
    isSubmitting,
    formType,
    setFormType,
    formAmount,
    setFormAmount,
    formCategoryId,
    setFormCategoryId,
    formAccountId,
    setFormAccountId,
    formDate,
    setFormDate,
    formNote,
    setFormNote,
    handleFormSubmit,
    fetchTransactionsData,
  };
}
