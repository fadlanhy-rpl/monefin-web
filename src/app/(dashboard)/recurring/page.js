"use client";

import { useState, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Calendar, 
  RefreshCcw, 
  Search, 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft, 
  PauseCircle, 
  PlayCircle, 
  TrendingUp, 
  TrendingDown, 
  ChevronDown,
  Check,
  Layers,
  X
} from "lucide-react";
import RecurringModal from "../../../components/recurring/RecurringModal";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { 
  getRecurringSettings, 
  createRecurringSetting, 
  updateRecurringSetting, 
  deleteRecurringSetting 
} from "../../../services/recurring.service";
import { getAccounts } from "../../../services/account.service";
import { getCategories } from "../../../services/category.service";
import { notifySuccess, notifyError } from "../../../lib/notify";
import { useCurrency } from "../../../hooks/useCurrency";
import { useLanguage } from "../../../context/LanguageContext";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function RecurringPage() {
  const { t, language } = useLanguage();
  const { formatCurrency } = useCurrency();
  const isEn = language === "en";

  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isVisible = true;
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // "all" | "income" | "expense"
  const [freqFilter, setFreqFilter] = useState("all"); // "all" | "daily" | "weekly" | "monthly"
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "active" | "paused"
  const [freqOpen, setFreqOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [freqCoords, setFreqCoords] = useState(null);
  const [statusCoords, setStatusCoords] = useState(null);
  const freqRef = useRef(null);
  const statusRef = useRef(null);
  const freqMenuRef = useRef(null);
  const statusMenuRef = useRef(null);

  const handleToggleFreq = () => {
    if (freqOpen) {
      setFreqOpen(false);
    } else {
      if (freqRef.current) {
        const rect = freqRef.current.getBoundingClientRect();
        setFreqCoords(rect);
      }
      setFreqOpen(true);
      setStatusOpen(false);
    }
  };

  const handleToggleStatus = () => {
    if (statusOpen) {
      setStatusOpen(false);
    } else {
      if (statusRef.current) {
        const rect = statusRef.current.getBoundingClientRect();
        setStatusCoords(rect);
      }
      setStatusOpen(true);
      setFreqOpen(false);
    }
  };

  const getDropdownStyle = (rect, width = 190) => {
    if (!rect || typeof window === "undefined") return {};
    const padding = 12;
    let left = rect.left;
    if (left + width > window.innerWidth - padding) {
      left = Math.max(padding, rect.right - width);
    }
    if (left < padding) {
      left = padding;
    }
    let top = rect.bottom + 6;
    const estHeight = 190;
    if (top + estHeight > window.innerHeight && rect.top - estHeight - 6 > 0) {
      top = rect.top - estHeight - 6;
    }
    return {
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      width: `${width}px`,
      zIndex: 9999,
    };
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        freqRef.current && !freqRef.current.contains(e.target) &&
        (!freqMenuRef.current || !freqMenuRef.current.contains(e.target))
      ) {
        setFreqOpen(false);
      }
      if (
        statusRef.current && !statusRef.current.contains(e.target) &&
        (!statusMenuRef.current || !statusMenuRef.current.contains(e.target))
      ) {
        setStatusOpen(false);
      }
    }

    function handleScrollOrResize() {
      setFreqOpen(false);
      setStatusOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, []);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  
  const initialFormState = {
    title: "",
    type: "expense",
    amount: "",
    period_type: "monthly",
    account_id: "",
    category_id: "",
    effective_date: new Date().toISOString().split("T")[0],
  };
  
  const [formState, setFormState] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const refreshData = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const [settingsRes, accountsRes, categoriesRes] = await Promise.all([
          getRecurringSettings(),
          getAccounts(),
          getCategories()
        ]);
        if (!ignore) {
          setSettings(settingsRes.data || []);
          setAccounts(accountsRes.data || []);
          setCategories(categoriesRes.data || []);
        }
      } catch (error) {
        if (!ignore && error?.status !== 401) {
          notifyError(isEn ? "Failed to load recurring transactions." : "Gagal memuat data transaksi rutin.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [isEn, refreshTrigger]);

  // Metric Projections (Normalized to Monthly Rate)
  const metrics = useMemo(() => {
    let monthlyIncome = 0;
    let monthlyExpense = 0;
    let activeCount = 0;
    let pausedCount = 0;

    settings.forEach((item) => {
      const amt = Number(item.amount) || 0;
      const isActive = item.is_active !== false;

      if (isActive) {
        activeCount += 1;
        // Normalize to monthly equivalent
        let monthlyValue = amt;
        if (item.period_type === "daily") {
          monthlyValue = amt * 30;
        } else if (item.period_type === "weekly") {
          monthlyValue = amt * 4.333;
        } else if (item.period_type === "yearly") {
          monthlyValue = amt / 12;
        }

        if (item.type === "income") {
          monthlyIncome += monthlyValue;
        } else {
          monthlyExpense += monthlyValue;
        }
      } else {
        pausedCount += 1;
      }
    });

    const netFlow = monthlyIncome - monthlyExpense;

    return {
      monthlyIncome,
      monthlyExpense,
      netFlow,
      activeCount,
      pausedCount,
      totalCount: settings.length,
    };
  }, [settings]);

  // Filtered Settings
  const filteredSettings = useMemo(() => {
    return settings.filter((item) => {
      // Type filter
      if (typeFilter !== "all" && item.type !== typeFilter) return false;

      // Frequency filter
      if (freqFilter !== "all" && item.period_type !== freqFilter) return false;

      // Status filter
      if (statusFilter === "active" && item.is_active === false) return false;
      if (statusFilter === "paused" && item.is_active !== false) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = (item.title || "").toLowerCase().includes(q);
        const catMatch = (item.category?.name || "").toLowerCase().includes(q);
        const accMatch = (item.account?.name || "").toLowerCase().includes(q);
        if (!titleMatch && !catMatch && !accMatch) return false;
      }

      return true;
    });
  }, [settings, typeFilter, freqFilter, statusFilter, searchQuery]);

  // Helper: Calculate Next Run Info
  const getNextRunInfo = (item) => {
    if (item.is_active === false) {
      return { 
        text: t("recurring.status_paused") || (isEn ? "Paused" : "Terjeda"), 
        isDueToday: false, 
        isPaused: true,
        dateStr: "-"
      };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let baseDate = item.last_processed_date 
      ? new Date(item.last_processed_date) 
      : (item.effective_date ? new Date(item.effective_date) : new Date());
    baseDate.setHours(0, 0, 0, 0);

    let nextDate = new Date(baseDate);
    if (item.last_processed_date) {
      if (item.period_type === "daily") {
        nextDate.setDate(nextDate.getDate() + 1);
      } else if (item.period_type === "weekly") {
        nextDate.setDate(nextDate.getDate() + 7);
      } else if (item.period_type === "monthly") {
        nextDate.setMonth(nextDate.getMonth() + 1);
      } else if (item.period_type === "yearly") {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
      }
    }

    if (nextDate < today) {
      nextDate = new Date(today);
    }

    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const dateStr = nextDate.toLocaleDateString(isEn ? "en-US" : "id-ID", {
      day: "numeric",
      month: "short",
    });

    if (diffDays === 0) {
      return { 
        text: t("recurring.today") || (isEn ? "Today" : "Hari Ini"), 
        isDueToday: true, 
        isPaused: false, 
        dateStr 
      };
    } else if (diffDays === 1) {
      return { 
        text: t("recurring.tomorrow") || (isEn ? "Tomorrow" : "Besok"), 
        isDueToday: false, 
        isPaused: false, 
        dateStr 
      };
    } else {
      return {
        text: isEn ? `in ${diffDays} days (${dateStr})` : `${diffDays} hari lagi (${dateStr})`,
        isDueToday: false,
        isPaused: false,
        dateStr,
      };
    }
  };

  // Toggle Active/Paused Status directly from card
  const handleToggleActive = async (item) => {
    const currentActive = item.is_active !== false;
    const newStatus = !currentActive;

    // Optimistic UI update
    setSettings((prev) =>
      prev.map((s) => (s.id === item.id ? { ...s, is_active: newStatus } : s))
    );

    try {
      await updateRecurringSetting(item.id, { is_active: newStatus });
      notifySuccess(
        newStatus
          ? (t("recurring.toast_status_updated") || (isEn ? "Recurring schedule resumed." : "Otomasi jadwal diaktifkan."))
          : (isEn ? "Recurring schedule paused." : "Otomasi jadwal dijeda.")
      );
    } catch (err) {
      // Revert on failure
      setSettings((prev) =>
        prev.map((s) => (s.id === item.id ? { ...s, is_active: currentActive } : s))
      );
      notifyError(err.message || (isEn ? "Failed to update status." : "Gagal mengubah status."));
    }
  };

  const openAddModal = () => {
    setModalMode("add");
    setEditingId(null);
    setFormState({
      ...initialFormState,
      account_id: accounts.length > 0 ? accounts[0].id : "",
      category_id: categories.length > 0 ? categories[0].id : "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setModalMode("edit");
    setEditingId(item.id);
    setFormState({
      title: item.title || "",
      type: item.type || "expense",
      amount: String(Math.floor(item.amount || 0)),
      period_type: item.period_type || "monthly",
      account_id: item.account_id || (accounts[0]?.id ?? ""),
      category_id: item.category_id || (categories[0]?.id ?? ""),
      effective_date: item.effective_date || new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (id) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  // Apply Quick Starter Template
  const handleApplyStarter = (template) => {
    setModalMode("add");
    setEditingId(null);
    const matchingAcc = accounts[0]?.id || "";
    const matchingCat = categories.find((c) => c.type === template.type)?.id || (categories[0]?.id ?? "");

    setFormState({
      title: template.title,
      type: template.type,
      amount: String(template.amount),
      period_type: template.period_type,
      account_id: matchingAcc,
      category_id: matchingCat,
      effective_date: new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formState.account_id || !formState.category_id || !formState.amount || !formState.title) {
        notifyError(isEn ? "All required fields must be filled!" : "Semua field wajib diisi!");
        return;
      }

      setIsSaving(true);
      if (modalMode === "add") {
        await createRecurringSetting(formState);
        notifySuccess(t("recurring.toast_add_success") || (isEn ? "Recurring transaction added." : "Transaksi rutin berhasil ditambahkan."));
      } else {
        await updateRecurringSetting(editingId, formState);
        notifySuccess(t("recurring.toast_update_success") || (isEn ? "Recurring transaction updated." : "Transaksi rutin berhasil diperbarui."));
      }
      setIsModalOpen(false);
      refreshData();
    } catch (error) {
      notifyError(error.message || (isEn ? "Failed to save schedule." : "Gagal menyimpan jadwal."));
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteRecurringSetting(deletingId);
      notifySuccess(t("recurring.toast_delete_success") || (isEn ? "Recurring transaction deleted." : "Transaksi rutin berhasil dihapus."));
      setIsDeleteModalOpen(false);
      refreshData();
    } catch (error) {
      notifyError(error.message || (isEn ? "Failed to delete schedule." : "Gagal menghapus jadwal."));
    } finally {
      setIsDeleting(false);
    }
  };

  const periodLabels = {
    daily: t("recurring.frequency_daily") || (isEn ? "Daily" : "Harian"),
    weekly: t("recurring.frequency_weekly") || (isEn ? "Weekly" : "Mingguan"),
    monthly: t("recurring.frequency_monthly") || (isEn ? "Monthly" : "Bulanan"),
    yearly: t("recurring.frequency_yearly") || (isEn ? "Yearly" : "Tahunan"),
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 min-w-0 pb-16 max-w-7xl mx-auto">
        
        {/* ================= HEADER SECTION ================= */}
        <div className={`transition-all duration-500 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'} flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#00685F]/10 text-[#00685F] text-[11px] font-bold tracking-wide">
                {isEn ? "Cash Flow Automation" : "Otomasi Arus Kas"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {t("recurring.title") || (isEn ? "Recurring Transactions" : "Transaksi Rutin")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              {t("recurring.subtitle") || (isEn ? "Automate scheduled income and expense tracking" : "Catat pemasukan dan pengeluaran secara otomatis sesuai jadwal.")}
            </p>
          </div>
          
          <button
            onClick={openAddModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-[#00685F] text-white font-bold rounded-2xl hover:bg-[#004D46] hover:shadow-lg hover:shadow-[#00685F]/20 transition-all active:scale-95 shrink-0 cursor-pointer min-h-[44px]"
          >
            <Plus className="w-5 h-5" />
            <span>{t("recurring.add_button") || (isEn ? "Add Recurring Schedule" : "Tambah Jadwal Rutin")}</span>
          </button>
        </div>

        {/* ================= METRIC PROJECTION BAR ================= */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 transition-all duration-500 delay-75 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          
          {/* 1. Monthly Recurring Income */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t("recurring.monthly_income") || (isEn ? "Recurring Income" : "Pemasukan Rutin")}
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl sm:text-2xl font-black text-emerald-600 tabular-nums">
                +{formatCurrency(metrics.monthlyIncome)}
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                {t("recurring.per_month") || "/ bulan"} • {metrics.activeCount} {isEn ? "active" : "aktif"}
              </p>
            </div>
          </div>

          {/* 2. Monthly Recurring Expense */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t("recurring.monthly_expense") || (isEn ? "Recurring Expense" : "Pengeluaran Rutin")}
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
                {formatCurrency(metrics.monthlyExpense)}
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                {t("recurring.per_month") || "/ bulan"} • {isEn ? "obligations" : "kewajiban rutin"}
              </p>
            </div>
          </div>

          {/* 3. Net Cashflow Projection */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t("recurring.net_cashflow") || (isEn ? "Net Recurring Flow" : "Arus Kas Otomatis")}
              </span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${metrics.netFlow >= 0 ? "bg-[#00685F]/10 text-[#00685F]" : "bg-rose-50 text-rose-600"}`}>
                {metrics.netFlow >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              </div>
            </div>
            <div className="mt-3">
              <div className={`text-xl sm:text-2xl font-black tabular-nums ${metrics.netFlow >= 0 ? "text-[#00685F]" : "text-rose-600"}`}>
                {metrics.netFlow >= 0 ? "+" : ""}{formatCurrency(metrics.netFlow)}
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                {metrics.netFlow >= 0 ? (isEn ? "Surplus projected" : "Estimasi surplus bulanan") : (isEn ? "Deficit projected" : "Estimasi defisit bulanan")}
              </p>
            </div>
          </div>

          {/* 4. Total Schedules & Status */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t("recurring.active_count") || (isEn ? "Active Schedules" : "Jadwal Aktif")}
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                <RefreshCcw className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {metrics.activeCount} <span className="text-xs text-slate-400 font-bold">/ {metrics.totalCount}</span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                {metrics.pausedCount} {t("recurring.status_paused") || (isEn ? "paused" : "terjeda")}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              {isEn ? "Managed automations" : "Total otomasi terdaftar"}
            </p>
          </div>

        </div>

        {/* ================= FILTER & SEARCH CONTROLS ================= */}
        <div className={`bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 shadow-sm transition-all duration-500 delay-150 ease-out transform relative z-20 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("recurring.search_placeholder") || (isEn ? "Search schedule title, category, or account..." : "Cari nama jadwal, kategori, atau rekening...")}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#00685F] focus:ring-2 focus:ring-[#00685F]/10 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Controls: Flex horizontal scroll on small screen, never stacking */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 w-full lg:w-auto shrink-0 select-none">
              
              {/* Type Filters */}
              <div className="bg-slate-100 p-1 rounded-xl flex items-center shrink-0">
                <button
                  onClick={() => setTypeFilter("all")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    typeFilter === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {t("recurring.filter_all") || (isEn ? "All" : "Semua")}
                </button>
                <button
                  onClick={() => setTypeFilter("income")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    typeFilter === "income" ? "bg-white text-[#00685F] shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {t("recurring.filter_income") || (isEn ? "Income" : "Pemasukan")}
                </button>
                <button
                  onClick={() => setTypeFilter("expense")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    typeFilter === "expense" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {t("recurring.filter_expense") || (isEn ? "Expense" : "Pengeluaran")}
                </button>
              </div>

              {/* Frequency Custom Dropdown Trigger */}
              <div className="relative shrink-0" ref={freqRef}>
                <button
                  type="button"
                  onClick={handleToggleFreq}
                  className={`flex items-center gap-2 px-3 py-2 border rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    freqOpen 
                      ? "border-[#00685F] ring-2 ring-[#00685F]/10 bg-white text-[#00685F] shadow-sm" 
                      : "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="shrink-0">
                    {freqFilter === "daily"
                      ? (t("recurring.frequency_daily") || (isEn ? "Daily" : "Harian"))
                      : freqFilter === "weekly"
                      ? (t("recurring.frequency_weekly") || (isEn ? "Weekly" : "Mingguan"))
                      : freqFilter === "monthly"
                      ? (t("recurring.frequency_monthly") || (isEn ? "Monthly" : "Bulanan"))
                      : (t("recurring.frequency_all") || (isEn ? "All Frequencies" : "Semua Frekuensi"))}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${freqOpen ? "rotate-180 text-[#00685F]" : ""}`} />
                </button>
              </div>

              {/* Status Custom Dropdown Trigger */}
              <div className="relative shrink-0" ref={statusRef}>
                <button
                  type="button"
                  onClick={handleToggleStatus}
                  className={`flex items-center gap-2 px-3 py-2 border rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    statusOpen 
                      ? "border-[#00685F] ring-2 ring-[#00685F]/10 bg-white text-[#00685F] shadow-sm" 
                      : "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700"
                  }`}
                >
                  {statusFilter === "active" ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  ) : statusFilter === "paused" ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  ) : (
                    <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                  <span className="shrink-0">
                    {statusFilter === "active"
                      ? (t("recurring.status_active") || (isEn ? "Active" : "Aktif"))
                      : statusFilter === "paused"
                      ? (t("recurring.status_paused") || (isEn ? "Paused" : "Terjeda"))
                      : (isEn ? "All Status" : "Semua Status")}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${statusOpen ? "rotate-180 text-[#00685F]" : ""}`} />
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* ================= MAIN CONTENT LIST ================= */}
        <div className={`transition-all duration-500 delay-200 ease-out transform relative z-10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          {isLoading ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00685F]/10 flex items-center justify-center text-[#00685F]">
                <RefreshCcw className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">{isEn ? "Loading recurring schedules..." : "Memuat jadwal transaksi rutin..."}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{isEn ? "Synchronizing automated entries" : "Sinkronisasi data otomasi finansial"}</p>
              </div>
            </div>
          ) : settings.length === 0 ? (
            
            /* ================= EMPTY STATE WITH STARTER TEMPLATES ================= */
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 sm:p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-3xl bg-[#00685F]/10 flex items-center justify-center text-[#00685F] mb-4">
                <RefreshCcw className="w-8 h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                {t("recurring.empty_title") || (isEn ? "No Recurring Transactions Yet" : "Belum Ada Jadwal Transaksi Rutin")}
              </h3>
              <p className="text-slate-500 mt-1 max-w-md text-xs sm:text-sm leading-relaxed">
                {t("recurring.empty_desc") || (isEn
                  ? "Set up recurring schedules so MoneFin automatically records recurring income and expenses without manual entry every time."
                  : "Pasang jadwal rutin agar sistem MoneFin mencatat pengeluaran dan pemasukan otomatis tanpa perlu input manual setiap kali.")}
              </p>

              {/* Starter Templates */}
              <div className="mt-8 w-full max-w-2xl text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">
                  {isEn ? "Or start quickly with these popular templates:" : "Atau mulai cepat dengan template populer:"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Starter 1: Salary */}
                  <button
                    onClick={() => handleApplyStarter({
                      title: isEn ? "Monthly Salary" : "Gaji Pokok",
                      type: "income",
                      amount: 5000000,
                      period_type: "monthly",
                    })}
                    className="p-4 rounded-2xl border border-slate-200/80 hover:border-[#00685F] hover:bg-[#00685F]/5 transition text-left cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-slate-900 text-sm group-hover:text-[#00685F] transition">
                      {t("recurring.starter_salary_title") || (isEn ? "Monthly Salary" : "Gaji Bulanan")}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {t("recurring.starter_salary_desc") || (isEn ? "Fixed monthly payday income" : "Pemasukan gajian tetap")}
                    </div>
                  </button>

                  {/* Starter 2: Bills */}
                  <button
                    onClick={() => handleApplyStarter({
                      title: isEn ? "Internet & Streaming" : "WiFi & Langganan",
                      type: "expense",
                      amount: 350000,
                      period_type: "monthly",
                    })}
                    className="p-4 rounded-2xl border border-slate-200/80 hover:border-[#00685F] hover:bg-[#00685F]/5 transition text-left cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2.5">
                      <ArrowDownLeft className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-slate-900 text-sm group-hover:text-[#00685F] transition">
                      {t("recurring.starter_bills_title") || (isEn ? "Bills & Subscriptions" : "Tagihan & Langganan")}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {t("recurring.starter_bills_desc") || (isEn ? "WiFi, Netflix, Gym" : "WiFi, listrik, atau gym")}
                    </div>
                  </button>

                  {/* Starter 3: Daily Ops */}
                  <button
                    onClick={() => handleApplyStarter({
                      title: isEn ? "Daily Food Allowance" : "Makan & Transport",
                      type: "expense",
                      amount: 50000,
                      period_type: "daily",
                    })}
                    className="p-4 rounded-2xl border border-slate-200/80 hover:border-[#00685F] hover:bg-[#00685F]/5 transition text-left cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-2.5">
                      <RefreshCcw className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-slate-900 text-sm group-hover:text-[#00685F] transition">
                      {t("recurring.starter_daily_title") || (isEn ? "Daily Operations" : "Operasional Harian")}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {t("recurring.starter_daily_desc") || (isEn ? "Daily food / commute" : "Alokasi makan harian")}
                    </div>
                  </button>

                </div>
              </div>

              <button
                onClick={openAddModal}
                className="mt-8 px-6 py-3 bg-[#00685F] text-white font-bold rounded-2xl hover:bg-[#004D46] shadow-sm transition active:scale-95 text-sm cursor-pointer"
              >
                {t("recurring.add_button") || (isEn ? "Add Recurring Schedule" : "Tambah Jadwal Rutin")}
              </button>
            </div>
          ) : filteredSettings.length === 0 ? (
            
            /* Empty Filter Result */
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                {isEn ? "No matching schedules found" : "Tidak ada jadwal yang cocok"}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                {isEn ? "Try adjusting your search query or filters." : "Coba sesuaikan kata kunci pencarian atau filter Anda."}
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setTypeFilter("all");
                  setFreqFilter("all");
                  setStatusFilter("all");
                }}
                className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition cursor-pointer"
              >
                {isEn ? "Reset Filters" : "Reset Filter"}
              </button>
            </div>

          ) : (
            
            /* ================= GRID OF RECURRING CARDS ================= */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSettings.map((item) => {
                const isIncome = item.type === "income";
                const isActive = item.is_active !== false;
                const nextRun = getNextRunInfo(item);
                const category = item.category || categories.find((c) => String(c.id) === String(item.category_id));
                const account = item.account || accounts.find((a) => String(a.id) === String(item.account_id));

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-3xl border transition-all duration-200 p-5 flex flex-col justify-between relative overflow-hidden group ${
                      isActive
                        ? "border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300"
                        : "border-slate-200 bg-slate-50/40 opacity-75 hover:opacity-100"
                    }`}
                  >
                    
                    {/* Top Row: Icon, Title & Status */}
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                            isIncome 
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100/50" 
                              : "bg-slate-100 text-slate-700 border border-slate-200/60"
                          }`}>
                            {isIncome ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-extrabold text-slate-900 text-base leading-snug truncate" title={item.title}>
                              {item.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] font-semibold text-slate-500">
                              <span className="truncate max-w-[120px]" title={category?.name}>
                                {category?.name || (isEn ? "Uncategorized" : "Tanpa Kategori")}
                              </span>
                              <span>•</span>
                              <span className="truncate max-w-[120px] text-slate-600" title={account?.name}>
                                {account?.name || (isEn ? "General Wallet" : "Rekening Utama")}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Active / Paused Status Pill */}
                        <div className="shrink-0">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              {t("recurring.status_active") || (isEn ? "Active" : "Aktif")}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                              {t("recurring.status_paused") || (isEn ? "Paused" : "Terjeda")}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Middle: Amount & Schedule Info */}
                      <div className="mt-5 pt-4 border-t border-slate-100/80 flex items-end justify-between gap-2">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">
                            {t("recurring.field_frequency") || (isEn ? "Frequency" : "Frekuensi")}
                          </p>
                          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100/80 px-2.5 py-1 rounded-xl">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            <span>{periodLabels[item.period_type] || item.period_type}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">
                            {t("recurring.field_amount") || (isEn ? "Amount" : "Nominal")}
                          </p>
                          <p className={`font-black text-lg sm:text-xl tabular-nums leading-none ${
                            isIncome ? "text-emerald-600" : "text-slate-900"
                          }`}>
                            {isIncome ? "+" : ""}{formatCurrency(item.amount)}
                          </p>
                        </div>
                      </div>

                      {/* Next Execution Badge */}
                      <div className="mt-3 py-2 px-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{t("recurring.next_run") || (isEn ? "Next run" : "Jadwal berikutnya")}:</span>
                        </div>
                        <span className={`font-bold ${nextRun.isDueToday ? "text-[#00685F]" : "text-slate-700"}`}>
                          {nextRun.text}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      {/* Pause / Resume Button */}
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer min-h-[36px] ${
                          isActive
                            ? "bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-600"
                            : "bg-[#00685F]/10 hover:bg-[#00685F]/20 text-[#00685F]"
                        }`}
                        title={isActive ? (isEn ? "Pause automation" : "Jeda otomasi") : (isEn ? "Resume automation" : "Aktifkan otomasi")}
                      >
                        {isActive ? (
                          <>
                            <PauseCircle className="w-4 h-4 text-slate-500" />
                            <span>{t("recurring.pause_action") || (isEn ? "Pause" : "Jeda")}</span>
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-4 h-4 text-[#00685F]" />
                            <span>{t("recurring.resume_action") || (isEn ? "Resume" : "Aktifkan")}</span>
                          </>
                        )}
                      </button>

                      {/* Edit & Delete Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                          aria-label={isEn ? "Edit schedule" : "Edit jadwal"}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(item.id)}
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          aria-label={isEn ? "Delete schedule" : "Hapus jadwal"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* ================= RECURRING MODAL ================= */}
      <RecurringModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalMode={modalMode}
        handleFormSubmit={handleFormSubmit}
        formState={formState}
        setFormState={setFormState}
        categories={categories}
        accounts={accounts}
        isSaving={isSaving}
      />

      {/* ================= CONFIRM DELETE MODAL ================= */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingId(null);
        }}
        onConfirm={confirmDelete}
        title={t("recurring.delete_title") || (isEn ? "Delete Recurring Transaction?" : "Hapus Transaksi Rutin?")}
        message={t("recurring.delete_desc") || (isEn
          ? "This automation schedule will be removed and transactions will no longer be created automatically. Past records remain intact."
          : "Jadwal otomatisasi ini akan dihapus dan transaksi tidak akan dicatat lagi secara berkala. Riwayat transaksi sebelumnya tetap aman.")}
        confirmText={t("recurring.btn_delete") || (isEn ? "Yes, Delete" : "Ya, Hapus")}
        cancelText={t("recurring.btn_cancel") || (isEn ? "Cancel" : "Batal")}
        isLoading={isDeleting}
      />

      {/* ================= FLOATING FILTER DROPDOWNS (PORTALED) ================= */}
      {mounted && freqOpen && freqCoords && createPortal(
        <div
          ref={freqMenuRef}
          style={getDropdownStyle(freqCoords, 196)}
          className="bg-white border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-200/50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150"
        >
          {[
            { value: "all", label: t("recurring.frequency_all") || (isEn ? "All Frequencies" : "Semua Frekuensi") },
            { value: "daily", label: t("recurring.frequency_daily") || (isEn ? "Daily" : "Harian") },
            { value: "weekly", label: t("recurring.frequency_weekly") || (isEn ? "Weekly" : "Mingguan") },
            { value: "monthly", label: t("recurring.frequency_monthly") || (isEn ? "Monthly" : "Bulanan") },
          ].map((opt) => {
            const isSelected = freqFilter === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setFreqFilter(opt.value);
                  setFreqOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                  isSelected
                    ? "bg-[#00685F]/10 text-[#00685F]"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#00685F]" />}
              </button>
            );
          })}
        </div>,
        document.body
      )}

      {mounted && statusOpen && statusCoords && createPortal(
        <div
          ref={statusMenuRef}
          style={getDropdownStyle(statusCoords, 176)}
          className="bg-white border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-200/50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150"
        >
          {[
            { value: "all", label: isEn ? "All Status" : "Semua Status", dot: null },
            { value: "active", label: t("recurring.status_active") || (isEn ? "Active" : "Aktif"), dot: "bg-emerald-500" },
            { value: "paused", label: t("recurring.status_paused") || (isEn ? "Paused" : "Terjeda"), dot: "bg-amber-400" },
          ].map((opt) => {
            const isSelected = statusFilter === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setStatusFilter(opt.value);
                  setStatusOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                  isSelected
                    ? "bg-[#00685F]/10 text-[#00685F]"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  {opt.dot ? (
                    <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                  ) : (
                    <Layers className={`w-3.5 h-3.5 ${isSelected ? "text-[#00685F]" : "text-slate-400"}`} />
                  )}
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#00685F]" />}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </DashboardLayout>
  );
}
