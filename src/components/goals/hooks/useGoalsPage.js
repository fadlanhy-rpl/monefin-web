"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  getGoals, 
  createGoal, 
  updateGoal, 
  deleteGoal, 
  depositGoal, 
  withdrawGoal 
} from "../../../services/goal.service";
import { getAccounts } from "../../../services/account.service";
import { useCurrency } from "../../../hooks/useCurrency";
import { useLanguage } from "../../../context/LanguageContext";

export function useGoalsPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { formatCurrency } = useCurrency();
  const isVisible = true;

  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search");
  const [searchQuery, setSearchQuery] = useState(() => urlSearch || "");

  // Active & Achieved Goals State
  const [goals, setGoals] = useState([]);
  const [achievedGoals, setAchievedGoals] = useState([]);

  // Sync with searchParams
  useEffect(() => {
    if (urlSearch !== null && urlSearch !== undefined) {
      const timer = setTimeout(() => {
        setSearchQuery(urlSearch);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [urlSearch]);

  // Filtered goals based on search
  const filteredGoals = !searchQuery.trim()
    ? goals
    : goals.filter((g) => 
        g.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        g.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Accounts State for Deposit / Withdraw
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");

  // Toast State
  const [toastMessage, setToastMessage] = useState("");

  // Modal & Confirm States
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [editingGoal, setEditingGoal] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form States - Goal
  const [formTitle, setFormTitle] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formTarget, setFormTarget] = useState("");
  const [formCurrent, setFormCurrent] = useState("");
  const [formDeadlineDate, setFormDeadlineDate] = useState("");
  const [formDeadlineText, setFormDeadlineText] = useState("");
  const [formType, setFormType] = useState("linear");
  const [formTag, setFormTag] = useState("Safety");
  const [formIcon, setFormIcon] = useState("target");

  // Modal States - Deposit & Withdraw
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [activeDepositGoal, setActiveDepositGoal] = useState(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositActionType, setDepositActionType] = useState("deposit"); // "deposit" | "withdraw"

  const triggerToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  }, []);

  const fetchGoalsData = useCallback(async () => {
    try {
      const res = await getGoals();
      const allGoals = res.data || [];
      setGoals(allGoals.filter((g) => !g.is_achieved));
      setAchievedGoals(allGoals.filter((g) => g.is_achieved));
    } catch (error) {
      if (error?.status !== 401) {
        console.error("Failed to fetch goals:", error.message || error);
      }
    }
  }, []);

  const fetchAccountsData = useCallback(async () => {
    try {
      const res = await getAccounts();
      const accs = res.data || [];
      setAccounts(accs);
      if (accs.length > 0 && !selectedAccountId) {
        setSelectedAccountId(String(accs[0].id));
      }
    } catch (error) {
      if (error?.status !== 401) {
        console.error("Failed to fetch accounts:", error.message || error);
      }
    }
  }, [selectedAccountId]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const [goalsRes, accsRes] = await Promise.all([getGoals(), getAccounts()]);
        if (!ignore) {
          const allGoals = goalsRes.data || [];
          setGoals(allGoals.filter((g) => !g.is_achieved));
          setAchievedGoals(allGoals.filter((g) => g.is_achieved));
          const accs = accsRes.data || [];
          setAccounts(accs);
          if (accs.length > 0) {
            setSelectedAccountId((prev) => prev || String(accs[0].id));
          }
        }
      } catch (error) {
        if (!ignore && error?.status !== 401) {
          console.error("Failed to load initial goals data:", error.message || error);
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  // Open Goal Modal (Add Mode)
  const openAddModal = (preset = null) => {
    setModalMode("add");
    setEditingGoal(null);
    setFormTitle(preset?.title || "");
    setFormSubtitle(preset?.subtitle || "");
    setFormTarget(preset?.target ? String(preset.target) : "");
    setFormCurrent("");
    setFormDeadlineDate("");
    setFormType(preset?.type || "linear");
    setFormTag(preset?.tag || (language === "en" ? "Safety" : "Keamanan"));
    setFormIcon(preset?.icon || "target");
    setIsGoalModalOpen(true);
  };

  // Open Goal Modal (Edit Mode)
  const openEditModal = (g) => {
    setModalMode("edit");
    setEditingGoal(g);
    setFormTitle(g.name);
    setFormSubtitle(g.description || "");
    setFormTarget(String(g.target_amount));
    setFormCurrent(String(g.current_amount));
    setFormDeadlineDate(g.deadline || "");
    setFormType(g.layout_type || "linear");
    setFormTag(g.color || "blue");
    setFormIcon(g.icon || "target");
    setIsGoalModalOpen(true);
  };

  const closeGoalModal = () => {
    setIsGoalModalOpen(false);
  };

  // Delete Goal
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
    setIsDeleting(true);
    try {
      await deleteGoal(deletingId);
      setGoals((prev) => prev.filter((g) => g.id !== deletingId));
      triggerToast(language === "en" ? "Savings goal deleted successfully." : "Target tabungan berhasil dihapus.");
    } catch (error) {
      console.error("Failed to delete goal:", error);
      triggerToast(error?.response?.data?.message || (language === "en" ? "Failed to delete goal." : "Gagal menghapus goal."));
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setDeletingId(null);
    }
  };

  // Submit Goal Form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const targetVal = parseFloat(formTarget) || 0;
    const currentVal = parseFloat(formCurrent) || 0;

    if (targetVal <= 0) {
      alert(language === "en" ? "Target amount must be a positive number!" : "Target nominal harus bernilai positif!");
      return;
    }

    const payload = {
      name: formTitle,
      description: formSubtitle || "Target tabungan",
      current_amount: currentVal,
      target_amount: targetVal,
      deadline: formDeadlineDate || null,
      layout_type: formType,
      color: formTag || "blue",
      icon: formIcon,
    };

    try {
      if (modalMode === "add") {
        await createGoal(payload);
        triggerToast(language === "en" ? "New savings goal created successfully!" : "Target tabungan baru berhasil dibuat!");
      } else {
        await updateGoal(editingGoal.id, payload);
        triggerToast(language === "en" ? "Savings goal updated successfully!" : "Target tabungan berhasil diperbarui!");
      }
      fetchGoalsData();
      setIsGoalModalOpen(false);
    } catch (error) {
      console.error("Failed to save goal:", error);
      triggerToast(error?.response?.data?.message || (language === "en" ? "Failed to save goal." : "Gagal menyimpan goal."));
    }
  };

  // Open Deposit / Withdraw Modal
  const openDepositModal = (g, mode = "deposit") => {
    setActiveDepositGoal(g);
    setDepositAmount("");
    setDepositActionType(mode);
    if (accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(String(accounts[0].id));
    }
    setIsDepositModalOpen(true);
  };

  const closeDepositModal = () => {
    setIsDepositModalOpen(false);
  };

  // Submit Deposit / Withdraw Form
  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount) || 0;

    if (amt <= 0) {
      alert(language === "en" ? "Transaction amount must be positive!" : "Nominal transaksi harus bernilai positif!");
      return;
    }

    if (!selectedAccountId) {
      alert(language === "en" ? "Please select a funding account first!" : "Pilih akun keuangan terlebih dahulu!");
      return;
    }

    if (!activeDepositGoal) return;

    try {
      const payload = {
        account_id: selectedAccountId,
        amount: amt,
      };
      
      if (depositActionType === "deposit") {
        const res = await depositGoal(activeDepositGoal.id, payload);
        triggerToast(res.message || (language === "en" ? `Successfully deposited ${formatCurrency(amt)} to ${activeDepositGoal.name}.` : `Berhasil menyetor ${formatCurrency(amt)} ke ${activeDepositGoal.name}.`));
      } else {
        const res = await withdrawGoal(activeDepositGoal.id, payload);
        triggerToast(res.message || (language === "en" ? `Successfully withdrew ${formatCurrency(amt)} from ${activeDepositGoal.name}.` : `Berhasil menarik ${formatCurrency(amt)} dari ${activeDepositGoal.name}.`));
      }
      
      fetchGoalsData();
      fetchAccountsData();
      setIsDepositModalOpen(false);
    } catch (error) {
      console.error("Failed to process deposit/withdraw:", error);
      triggerToast(error?.response?.data?.message || (language === "en" ? "Transaction failed." : "Transaksi gagal."));
    }
  };

  // Toggle Pin Goal
  const handleTogglePin = async (g) => {
    try {
      const newPinnedState = !g.is_pinned;
      await updateGoal(g.id, { is_pinned: newPinnedState });
      triggerToast(newPinnedState 
        ? (language === "en" ? "Goal pinned to Page 1!" : "Target disematkan di Halaman 1!") 
        : (language === "en" ? "Goal unpinned." : "Sematkan target dilepas."));
      fetchGoalsData();
    } catch (error) {
      console.error("Failed to toggle pin:", error);
      triggerToast(language === "en" ? "Failed to update pin status." : "Gagal mengubah status semat.");
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    router.replace("/goals");
  };

  return {
    t,
    language,
    isVisible,
    searchQuery,
    setSearchQuery,
    clearSearch,
    goals,
    achievedGoals,
    filteredGoals,
    accounts,
    selectedAccountId,
    setSelectedAccountId,
    toastMessage,
    isGoalModalOpen,
    modalMode,
    editingGoal,
    openAddModal,
    openEditModal,
    closeGoalModal,
    isConfirmOpen,
    isDeleting,
    handleDeleteClick,
    closeConfirmModal,
    handleConfirmDelete,
    formTitle,
    setFormTitle,
    formSubtitle,
    setFormSubtitle,
    formTarget,
    setFormTarget,
    formCurrent,
    setFormCurrent,
    formDeadlineDate,
    setFormDeadlineDate,
    formDeadlineText,
    setFormDeadlineText,
    formType,
    setFormType,
    formTag,
    setFormTag,
    formIcon,
    setFormIcon,
    handleFormSubmit,
    isDepositModalOpen,
    activeDepositGoal,
    depositAmount,
    setDepositAmount,
    depositActionType,
    setDepositActionType,
    openDepositModal,
    closeDepositModal,
    handleDepositSubmit,
    handleTogglePin,
  };
}
