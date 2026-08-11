"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import GoalsHeader from "../../../components/goals/GoalsHeader";
import GoalsGrid from "../../../components/goals/GoalsGrid";
import GoalsStats from "../../../components/goals/GoalsStats";
import AchievedGoals from "../../../components/goals/AchievedGoals";
import GoalModal from "../../../components/goals/GoalModal";
import DepositModal from "../../../components/goals/DepositModal";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { CheckCircle2 } from "lucide-react";
import { getGoals, createGoal, updateGoal, deleteGoal, depositGoal, withdrawGoal } from "../../../services/goal.service";
import { getAccounts } from "../../../services/account.service";

export default function GoalsPage() {
  const [isVisible, setIsVisible] = useState(false);

  // Active Goals State
  const [goals, setGoals] = useState([]);

  // Achieved Goals State
  const [achievedGoals, setAchievedGoals] = useState([]);

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

  useEffect(() => {
    setIsVisible(true);
    fetchGoalsData();
    fetchAccountsData();
  }, []);

  const fetchGoalsData = async () => {
    try {
      const res = await getGoals();
      const allGoals = res.data;
      setGoals(allGoals.filter(g => !g.is_achieved));
      setAchievedGoals(allGoals.filter(g => g.is_achieved));
    } catch (error) {
      console.error("Failed to fetch goals:", error);
    }
  };

  const fetchAccountsData = async () => {
    try {
      const res = await getAccounts();
      const accs = res.data || [];
      setAccounts(accs);
      if (accs.length > 0 && !selectedAccountId) {
        setSelectedAccountId(String(accs[0].id));
      }
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
    }
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Open Goal Modal (Add Mode)
  const openAddModal = () => {
    setModalMode("add");
    setEditingGoal(null);
    setFormTitle("");
    setFormSubtitle("");
    setFormTarget("");
    setFormCurrent("");
    setFormDeadlineDate("");
    setFormType("linear");
    setFormTag("Safety");
    setFormIcon("target");
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

  // Delete Goal
  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteGoal(deletingId);
      setGoals(prev => prev.filter(g => g.id !== deletingId));
      triggerToast("Target tabungan berhasil dihapus.");
    } catch (error) {
      console.error("Failed to delete goal:", error);
      triggerToast(error?.response?.data?.message || "Gagal menghapus goal.");
    } finally {
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
      alert("Target nominal harus bernilai positif!");
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
      icon: formIcon
    };

    try {
      if (modalMode === "add") {
        await createGoal(payload);
        triggerToast("Target tabungan baru berhasil dibuat!");
      } else {
        await updateGoal(editingGoal.id, payload);
        triggerToast("Target tabungan berhasil diperbarui!");
      }
      fetchGoalsData();
      setIsGoalModalOpen(false);
    } catch (error) {
      console.error("Failed to save goal:", error);
      triggerToast(error?.response?.data?.message || "Gagal menyimpan goal.");
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

  // Submit Deposit / Withdraw Form
  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount) || 0;

    if (amt <= 0) {
      alert("Nominal transaksi harus bernilai positif!");
      return;
    }

    if (!selectedAccountId) {
      alert("Pilih akun keuangan terlebih dahulu!");
      return;
    }

    if (!activeDepositGoal) return;

    try {
      const payload = {
        account_id: selectedAccountId,
        amount: amt
      };
      
      if (depositActionType === "deposit") {
        await depositGoal(activeDepositGoal.id, payload);
        triggerToast(`Berhasil menyetor Rp ${amt.toLocaleString("id-ID")} ke ${activeDepositGoal.name}! 💰`);
      } else {
        await withdrawGoal(activeDepositGoal.id, payload);
        triggerToast(`Berhasil menarik Rp ${amt.toLocaleString("id-ID")} dari ${activeDepositGoal.name}! 🏧`);
      }
      
      fetchGoalsData();
      fetchAccountsData();
      setIsDepositModalOpen(false);
    } catch (error) {
      console.error("Failed to process deposit/withdraw:", error);
      triggerToast(error?.response?.data?.message || "Transaksi gagal.");
    }
  };

  // Toggle Pin Goal
  const handleTogglePin = async (g) => {
    try {
      const newPinnedState = !g.is_pinned;
      await updateGoal(g.id, { is_pinned: newPinnedState });
      triggerToast(newPinnedState ? "Target disematkan di Halaman 1!" : "Sematkan target dilepas.");
      fetchGoalsData();
    } catch (error) {
      console.error("Failed to toggle pin:", error);
      triggerToast("Gagal mengubah status semat.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Breadcrumb & Header Title */}
        <GoalsHeader 
          isVisible={isVisible}
          activeGoalsCount={goals.length}
          openAddModal={openAddModal}
        />

        {/* Goals Active Cards Grid */}
        <div className={`transition-all duration-700 delay-300 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <GoalsGrid 
            goals={goals}
            openEditModal={openEditModal}
            handleDelete={handleDeleteClick}
            openDepositModal={openDepositModal}
            handleTogglePin={handleTogglePin}
          />
        </div>

        {/* Stats Row & Tips Cerdas */}
        <div className={`transition-all duration-700 delay-500 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <GoalsStats 
            savingRate={850000}
            savingRateIncrease={12}
          />
        </div>

        {/* Achieved/Completed Goals */}
        <div className={`transition-all duration-700 delay-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <AchievedGoals 
            achievedGoals={achievedGoals}
          />
        </div>

      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-5 duration-300 z-50 border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Create / Edit Goal Modal */}
      <GoalModal 
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        modalMode={modalMode}
        handleFormSubmit={handleFormSubmit}
        formTitle={formTitle}
        setFormTitle={setFormTitle}
        formSubtitle={formSubtitle}
        setFormSubtitle={setFormSubtitle}
        formTarget={formTarget}
        setFormTarget={setFormTarget}
        formCurrent={formCurrent}
        setFormCurrent={setFormCurrent}
        formDeadlineDate={formDeadlineDate}
        setFormDeadlineDate={setFormDeadlineDate}
        formDeadlineText={formDeadlineText}
        setFormDeadlineText={setFormDeadlineText}
        formType={formType}
        setFormType={setFormType}
        formTag={formTag}
        setFormTag={setFormTag}
        formIcon={formIcon}
        setFormIcon={setFormIcon}
      />

      {/* Deposit & Withdraw Modal */}
      <DepositModal 
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        goal={activeDepositGoal}
        accounts={accounts}
        selectedAccountId={selectedAccountId}
        setSelectedAccountId={setSelectedAccountId}
        depositAmount={depositAmount}
        setDepositAmount={setDepositAmount}
        actionType={depositActionType}
        setActionType={setDepositActionType}
        handleDepositSubmit={handleDepositSubmit}
      />

      {/* Modern Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Target Tabungan?"
        message="Apakah Anda yakin ingin menghapus target tabungan ini? Progress akumulasi dana akan dihentikan."
        confirmText="Ya, Hapus"
      />
    </DashboardLayout>
  );
}
