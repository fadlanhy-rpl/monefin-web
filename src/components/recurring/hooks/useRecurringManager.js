"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  getRecurringSettings, 
  createRecurringSetting, 
  updateRecurringSetting, 
  deleteRecurringSetting 
} from "../../../services/recurring.service";
import { getAccounts } from "../../../services/account.service";
import { getCategories } from "../../../services/category.service";
import { notifySuccess, notifyError } from "../../../lib/notify";
import { useLanguage } from "../../../context/LanguageContext";

export function useRecurringManager() {
  const { t, language } = useLanguage();
  const isEn = language === "en";

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

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  
  const initialFormState = useMemo(() => ({
    title: "",
    type: "expense",
    amount: "",
    period_type: "monthly",
    account_id: "",
    category_id: "",
    effective_date: new Date().toISOString().split("T")[0],
  }), []);
  
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

  const closeModal = () => setIsModalOpen(false);

  const openDeleteModal = (id) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingId(null);
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

  const resetFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setFreqFilter("all");
    setStatusFilter("all");
  };

  return {
    t,
    isEn,
    isLoading,
    isSaving,
    settings,
    accounts,
    categories,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    freqFilter,
    setFreqFilter,
    statusFilter,
    setStatusFilter,
    resetFilters,
    metrics,
    filteredSettings,
    getNextRunInfo,
    handleToggleActive,
    isModalOpen,
    modalMode,
    formState,
    setFormState,
    openAddModal,
    openEditModal,
    closeModal,
    isDeleteModalOpen,
    openDeleteModal,
    closeDeleteModal,
    isDeleting,
    handleApplyStarter,
    handleFormSubmit,
    confirmDelete,
  };
}
