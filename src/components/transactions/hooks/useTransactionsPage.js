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
import { getBootstrapSnapshot } from "../../../services/bootstrap.service";
import { useLanguage } from "../../../context/LanguageContext";
import { useCurrency } from "../../../hooks/useCurrency";
import { formatDate } from "../../../lib/utils";

function formatDateInput(dateStr) {
  if (!dateStr) return "";
  if (dateStr.includes("-")) {
    return dateStr.split(" ")[0].split("T")[0];
  }
  return dateStr;
}

/**
 * Format Date object to YYYY-MM-DD in the user's LOCAL timezone (e.g. WIB / UTC+7),
 * avoiding the UTC shift bug of toISOString() between 00:00 and 07:00 WIB.
 */
function toLocalDateString(date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
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
  
  // Data State (hydrated synchronously from bootstrap snapshot if available)
  const [transactions, setTransactions] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState(null);
  const [categories, setCategories] = useState(() => {
    const snap = getBootstrapSnapshot();
    return Array.isArray(snap?.categories) && snap.categories.length > 0 ? snap.categories : [];
  });
  const [accounts, setAccounts] = useState(() => {
    const snap = getBootstrapSnapshot();
    return Array.isArray(snap?.accounts) && snap.accounts.length > 0 ? snap.accounts : [];
  });
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
  const [formDate, setFormDate] = useState(() => toLocalDateString());
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

  // Resilient fetcher for Categories and Accounts (with automatic force-refresh fallback when empty)
  const fetchDropdownData = useCallback(async (force = false) => {
    try {
      const [catSettled, accSettled] = await Promise.allSettled([
        getCategories("", force).then(async (res) => {
          if (!force && (!Array.isArray(res?.data) || res.data.length === 0)) {
            return await getCategories("", true);
          }
          return res;
        }),
        getAccounts(force).then(async (res) => {
          if (!force && (!Array.isArray(res?.data) || res.data.length === 0)) {
            return await getAccounts(true);
          }
          return res;
        }),
      ]);

      if (catSettled.status === "fulfilled" && Array.isArray(catSettled.value?.data) && catSettled.value.data.length > 0) {
        setCategories(catSettled.value.data);
      }
      if (accSettled.status === "fulfilled" && Array.isArray(accSettled.value?.data) && accSettled.value.data.length > 0) {
        setAccounts(accSettled.value.data);
      }
    } catch (error) {
      if (error?.status !== 401) {
        console.error("Error fetching categories or accounts:", error?.message || error);
      }
    }
  }, []);

  // Fetch Categories and Accounts on mount + listen to /api/bootstrap completion
  useEffect(() => {
    fetchDropdownData(false);

    const handleBootstrapReady = (e) => {
      const bundle = e?.detail || getBootstrapSnapshot();
      if (Array.isArray(bundle?.categories) && bundle.categories.length > 0) {
        setCategories(bundle.categories);
      }
      if (Array.isArray(bundle?.accounts) && bundle.accounts.length > 0) {
        setAccounts(bundle.accounts);
      }
    };

    window.addEventListener("monefin:bootstrap-ready", handleBootstrapReady);
    return () => {
      window.removeEventListener("monefin:bootstrap-ready", handleBootstrapReady);
    };
  }, [fetchDropdownData]);

  // Auto-populate default Category (matching formType) and Account when modal is open or data arrives on cold start
  useEffect(() => {
    if (!isModalOpen) return;

    if (accounts.length > 0) {
      const accountExists = accounts.some((a) => String(a.id) === String(formAccountId));
      if (!formAccountId || !accountExists) {
        setFormAccountId(accounts[0].id);
      }
    }

    if (categories.length > 0) {
      const matchingCategories = categories.filter((c) =>
        formType === "expense" ? c.type === "expense" || !c.type : c.type === "income" || !c.type
      );
      const pool = matchingCategories.length > 0 ? matchingCategories : categories;
      const currentInPool = pool.some((c) => String(c.id) === String(formCategoryId));
      if (!formCategoryId || (modalMode === "add" && !currentInPool)) {
        setFormCategoryId(pool[0].id);
      }
    }
  }, [isModalOpen, modalMode, formType, categories, accounts, formCategoryId, formAccountId]);

  // Compute date range based on dateFilter using LOCAL timezone (fixes 00:00–07:00 WIB UTC bug)
  const getDateRange = useCallback(() => {
    const today = new Date();
    let start_date = null;
    let end_date = null;

    if (dateFilter === "last_7_days") {
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
      start_date = toLocalDateString(lastWeek);
      end_date = toLocalDateString(today);
    } else if (dateFilter === "last_30_days") {
      const lastMonth = new Date(today);
      lastMonth.setDate(today.getDate() - 30);
      start_date = toLocalDateString(lastMonth);
      end_date = toLocalDateString(today);
    } else if (dateFilter === "this_month") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      start_date = toLocalDateString(firstDay);
      end_date = toLocalDateString(today);
    } else if (dateFilter === "this_year") {
      const firstDay = new Date(today.getFullYear(), 0, 1);
      start_date = toLocalDateString(firstDay);
      end_date = toLocalDateString(today);
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
  const openAddModal = useCallback((initialType = "expense") => {
    const resolvedType = initialType === "income" ? "income" : "expense";
    setModalMode("add");
    setEditingTransaction(null);
    setFormType(resolvedType);
    setFormAmount("");
    setFormNote("");

    const matchingCats = categories.filter((c) =>
      resolvedType === "expense" ? c.type === "expense" || !c.type : c.type === "income" || !c.type
    );
    const defaultCat = matchingCats[0] || categories[0];
    setFormCategoryId(defaultCat ? defaultCat.id : "");
    setFormAccountId(accounts.length > 0 ? accounts[0].id : "");
    setFormDate(toLocalDateString());
    setIsModalOpen(true);

    // Ensure accounts & categories are fetched immediately if still empty on cold start
    if (categories.length === 0 || accounts.length === 0) {
      fetchDropdownData(true);
    }
  }, [categories, accounts, fetchDropdownData]);

  const openEditModal = (t) => {
    setModalMode("edit");
    setEditingTransaction(t);
    setFormType(t.type);
    setFormAmount(String(Math.round(Math.abs(Number(t.amount) || 0))));
    setFormCategoryId(t.category_id || t.category?.id || "");
    setFormAccountId(t.account_id || t.account?.id || "");
    setFormDate(formatDateInput(t.transaction_date));
    setFormNote(t.description || "");
    setIsModalOpen(true);

    if (categories.length === 0 || accounts.length === 0) {
      fetchDropdownData(true);
    }
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
      const targetTx = transactions.find((tx) => String(tx.id) === String(deletingId));
      await deleteTransaction(deletingId);

      // Instant UI update (0ms perceived delay)
      setTransactions((prev) => prev.filter((tx) => String(tx.id) !== String(deletingId)));
      if (targetTx) {
        const amt = Math.abs(parseFloat(targetTx.amount) || 0);
        setStats((prev) => {
          const income = targetTx.type === "income" ? Math.max(0, prev.income - amt) : prev.income;
          const expense = targetTx.type === "expense" ? Math.max(0, prev.expense - amt) : prev.expense;
          return { income, expense, net: income - expense };
        });
      }

      toast.success(language === "en" ? "Transaction successfully deleted!" : "Transaksi berhasil dihapus!");
      fetchTransactionsData(true);
      fetchDropdownData(true);
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

    const cleanAmtStr =
      typeof formAmount === "number" || /^-?\d+\.\d{1,2}$/.test(String(formAmount).trim())
        ? String(Math.round(Number(formAmount) || 0))
        : String(formAmount).replace(/\D/g, "");
    const amt = parseFloat(cleanAmtStr);
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
      const selectedCatObj = categories.find((c) => String(c.id) === String(formCategoryId)) || null;
      const selectedAccObj = accounts.find((a) => String(a.id) === String(formAccountId)) || null;

      if (modalMode === "add") {
        const res = await createTransaction(payload);
        const createdTx = res?.data
          ? {
              ...res.data,
              category: res.data.category || selectedCatObj,
              account: res.data.account || selectedAccObj,
            }
          : {
              id: `temp_${Date.now()}`,
              ...payload,
              category: selectedCatObj,
              account: selectedAccObj,
            };

        // Instant UI update (Doherty Threshold < 100ms): prepend immediately to list & stats
        setTransactions((prev) => [createdTx, ...prev.filter((tx) => String(tx.id) !== String(createdTx.id))]);
        setPaginationMeta((prev) => (prev ? { ...prev, total: (prev.total || 0) + 1 } : prev));
        setStats((prev) => {
          const income = formType === "income" ? prev.income + amt : prev.income;
          const expense = formType === "expense" ? prev.expense + amt : prev.expense;
          return { income, expense, net: income - expense };
        });
        setAccounts((prev) =>
          prev.map((acc) => {
            if (String(acc.id) !== String(formAccountId)) return acc;
            const delta = formType === "income" ? amt : -amt;
            return { ...acc, balance: Number(acc.balance || 0) + delta };
          })
        );

        toast.success(language === "en" ? "Transaction successfully added!" : "Transaksi berhasil ditambahkan!");
      } else {
        const res = await updateTransaction(editingTransaction.id, payload);
        const updatedTx = res?.data
          ? {
              ...res.data,
              category: res.data.category || selectedCatObj,
              account: res.data.account || selectedAccObj,
            }
          : {
              ...editingTransaction,
              ...payload,
              category: selectedCatObj,
              account: selectedAccObj,
            };

        setTransactions((prev) =>
          prev.map((tx) => (String(tx.id) === String(editingTransaction.id) ? updatedTx : tx))
        );
        toast.success(language === "en" ? "Transaction successfully updated!" : "Transaksi berhasil diperbarui!");
      }
      setIsModalOpen(false);
      // Revalidate in background for full server consistency
      fetchTransactionsData(true);
      fetchDropdownData(true);
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
    const todayStr = toLocalDateString();
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
