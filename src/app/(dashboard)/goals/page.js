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

export default function GoalsPage() {
  const [isVisible, setIsVisible] = useState(false);

  // Active Goals State
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Beli Laptop Baru",
      subtitle: "Target Reward untuk Pencapaian Karier",
      current: 3200000,
      target: 5000000,
      deadlineDate: "31 Des 2026",
      deadlineText: "5 bln lagi",
      type: "linear",
      icon: "laptop"
    },
    {
      id: 2,
      title: "Dana Darurat",
      tag: "Safety",
      current: 7500000,
      target: 10000000,
      statusText: "Stable",
      deadlineDate: "Ongoing",
      type: "circular",
      icon: "shield"
    }
  ]);

  // Achieved Goals State
  const [achievedGoals, setAchievedGoals] = useState([
    {
      id: 101,
      title: "Liburan ke Jepang",
      completedDate: "15 May 2024",
      amount: 15000000,
      badge: "VERIFIED",
      iconType: "plane"
    },
    {
      id: 102,
      title: "Sertifikasi Cloud Arch",
      completedDate: "02 Feb 2024",
      amount: 3500000,
      badge: "VERIFIED",
      iconType: "graduation-cap"
    }
  ]);

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

  // Modal States - Deposit
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositGoal, setDepositGoal] = useState(null);
  const [depositAmount, setDepositAmount] = useState("");

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
    setFormDeadlineDate("31 Des 2026");
    setFormDeadlineText("5 bln lagi");
    setFormType("linear");
    setFormTag("Safety");
    setFormIcon("target");
    setIsGoalModalOpen(true);
  };

  // Open Goal Modal (Edit Mode)
  const openEditModal = (g) => {
    setModalMode("edit");
    setEditingGoal(g);
    setFormTitle(g.title);
    setFormSubtitle(g.subtitle || "");
    setFormTarget(String(g.target));
    setFormCurrent(String(g.current));
    setFormDeadlineDate(g.deadlineDate || "");
    setFormDeadlineText(g.deadlineText || "");
    setFormType(g.type);
    setFormTag(g.tag || "Safety");
    setFormIcon(g.icon || "target");
    setIsGoalModalOpen(true);
  };

  // Delete Goal
  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingId) return;
    setGoals(prev => prev.filter(g => g.id !== deletingId));
    triggerToast("Target tabungan berhasil dihapus.");
    setIsConfirmOpen(false);
    setDeletingId(null);
  };

  // Submit Goal Form
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const targetVal = parseInt(formTarget, 10);
    const currentVal = parseInt(formCurrent, 10) || 0;

    if (isNaN(targetVal) || targetVal <= 0) {
      alert("Target nominal harus bernilai positif!");
      return;
    }

    if (modalMode === "add") {
      const newGoal = {
        id: Date.now(),
        title: formTitle,
        subtitle: formSubtitle || "Target tabungan kustom",
        current: currentVal,
        target: targetVal,
        deadlineDate: formDeadlineDate || "Ongoing",
        deadlineText: formDeadlineText || "Ongoing",
        type: formType,
        tag: formTag || "Savings",
        statusText: "Stable",
        icon: formIcon
      };
      setGoals(prev => [...prev, newGoal]);
      triggerToast("Target tabungan baru berhasil dibuat!");
    } else {
      setGoals(prev => prev.map(g => g.id === editingGoal.id ? {
        ...g,
        title: formTitle,
        subtitle: formSubtitle,
        current: currentVal,
        target: targetVal,
        deadlineDate: formDeadlineDate,
        deadlineText: formDeadlineText,
        type: formType,
        tag: formTag,
        icon: formIcon
      } : g));
      triggerToast("Target tabungan berhasil diperbarui!");
    }

    setIsGoalModalOpen(false);
  };

  // Open Deposit Modal
  const openDepositModal = (g) => {
    setDepositGoal(g);
    setDepositAmount("");
    setIsDepositModalOpen(true);
  };

  // Submit Deposit Form
  const handleDepositSubmit = (e) => {
    e.preventDefault();
    const amt = parseInt(depositAmount, 10);

    if (isNaN(amt) || amt <= 0) {
      alert("Jumlah deposit harus berupa angka positif!");
      return;
    }

    setGoals(prev => prev.map(g => {
      if (g.id === depositGoal.id) {
        const nextCurrent = g.current + amt;
        
        // If target achieved, we can trigger success message
        if (nextCurrent >= g.target) {
          triggerToast(`Selamat! Target "${g.title}" telah tercapai! 🎉`);
        } else {
          triggerToast(`Berhasil menyimpan Rp ${amt.toLocaleString("id-ID")} ke ${g.title}!`);
        }

        return {
          ...g,
          current: nextCurrent
        };
      }
      return g;
    }));

    setIsDepositModalOpen(false);
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

      {/* Deposit Modal */}
      <DepositModal 
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        goal={depositGoal}
        depositAmount={depositAmount}
        setDepositAmount={setDepositAmount}
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
