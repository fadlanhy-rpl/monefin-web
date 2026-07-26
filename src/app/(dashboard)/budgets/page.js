"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import BudgetsHeader from "../../../components/budgets/BudgetsHeader";
import BudgetsGrid from "../../../components/budgets/BudgetsGrid";
import BudgetsOverview from "../../../components/budgets/BudgetsOverview";
import BudgetModal from "../../../components/budgets/BudgetModal";
import { Utensils, Car, ShoppingBag, Zap, Film, PiggyBank, Info } from "lucide-react";

// Helper to get category icon component
function getCategoryIcon(iconType) {
  switch (iconType) {
    case "utensils": return <Utensils className="w-6 h-6" />;
    case "car": return <Car className="w-6 h-6" />;
    case "shopping-bag": return <ShoppingBag className="w-6 h-6" />;
    case "zap": return <Zap className="w-6 h-6" />;
    case "film": return <Film className="w-6 h-6" />;
    case "piggy-bank": return <PiggyBank className="w-6 h-6" />;
    default: return <Info className="w-6 h-6" />;
  }
}

export default function BudgetsPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [viewMode, setViewMode] = useState("card"); // "card" | "list"
  const [monthIndex, setMonthIndex] = useState(2); // Default to July 2026
  const months = ["May 2026", "June 2026", "July 2026"];

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Monthly budgets data store
  const [monthlyBudgets, setMonthlyBudgets] = useState({
    "May 2026": [
      { id: 1, category: "Food & Dining", description: "Daily meals and groceries", spent: 1500000, limit: 1800000, iconType: "utensils" },
      { id: 2, category: "Transport", description: "Fuel, tolls, and public transit", spent: 800000, limit: 1200000, iconType: "car" },
      { id: 3, category: "Shopping", description: "Clothing and personal items", spent: 1200000, limit: 1000000, iconType: "shopping-bag" }
    ],
    "June 2026": [
      { id: 1, category: "Food & Dining", description: "Daily meals and groceries", spent: 1800000, limit: 2000000, iconType: "utensils" },
      { id: 2, category: "Transport", description: "Fuel, tolls, and public transit", spent: 1100000, limit: 1500000, iconType: "car" },
      { id: 3, category: "Shopping", description: "Clothing and personal items", spent: 900000, limit: 1000000, iconType: "shopping-bag" },
      { id: 4, category: "Utilities", description: "Electricity, water, and internet", spent: 600000, limit: 1500000, iconType: "zap" }
    ],
    "July 2026": [
      { id: 1, category: "Food & Dining", description: "Daily meals and groceries", spent: 1200000, limit: 2000000, iconType: "utensils" },
      { id: 2, category: "Transport", description: "Fuel, tolls, and public transit", spent: 1600000, limit: 2000000, iconType: "car" },
      { id: 3, category: "Shopping", description: "Clothing and personal items", spent: 1050000, limit: 1000000, iconType: "shopping-bag" },
      { id: 4, category: "Utilities", description: "Electricity, water, and internet", spent: 450000, limit: 1500000, iconType: "zap" },
      { id: 5, category: "Entertainment", description: "Streaming, cinema, and outings", spent: 720000, limit: 800000, iconType: "film" },
      { id: 6, category: "Savings Goal", description: "Emergency fund & investment", spent: 5000000, limit: 5000000, iconType: "piggy-bank" },
      { id: 7, category: "Education", description: "Books and learning resources", spent: 300000, limit: 1000000, iconType: "zap" },
      { id: 8, category: "Health & Fitness", description: "Gym membership and medicines", spent: 250000, limit: 500000, iconType: "utensils" }
    ]
  });

  const activeMonth = months[monthIndex];
  const budgets = monthlyBudgets[activeMonth] || [];

  // Pagination parameters
  const totalPages = Math.ceil(budgets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBudgets = budgets.slice(startIndex, endIndex);

  // Auto-correct page if items count shrinks
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [budgets.length, currentPage, totalPages]);

  // Reset page when switching months
  useEffect(() => {
    setCurrentPage(1);
  }, [monthIndex]);

  // Calculation summaries
  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const remainingBudget = Math.max(0, totalLimit - totalSpent);
  const overallPercentage = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;
  
  // Donut chart parameters
  const radius = 70;
  const circumference = 2 * Math.PI * radius; // ~439.8
  const strokeDashoffset = circumference - (circumference * Math.min(overallPercentage, 100)) / 100;

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [editingBudget, setEditingBudget] = useState(null);

  // Form states
  const [formCategory, setFormCategory] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formLimit, setFormLimit] = useState("");
  const [formSpent, setFormSpent] = useState("");
  const [formIcon, setFormIcon] = useState("utensils");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Handlers for month change
  const handlePrevMonth = () => {
    if (monthIndex > 0) {
      setMonthIndex(monthIndex - 1);
    }
  };

  const handleNextMonth = () => {
    if (monthIndex < months.length - 1) {
      setMonthIndex(monthIndex + 1);
    }
  };

  // Open Modal triggers
  const openAddModal = () => {
    setModalMode("add");
    setEditingBudget(null);
    setFormCategory("");
    setFormDescription("");
    setFormLimit("");
    setFormSpent("");
    setFormIcon("utensils");
    setIsModalOpen(true);
  };

  const openEditModal = (b) => {
    setModalMode("edit");
    setEditingBudget(b);
    setFormCategory(b.category);
    setFormDescription(b.description);
    setFormLimit(String(b.limit));
    setFormSpent(String(b.spent));
    setFormIcon(b.iconType);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus anggaran kategori ini?")) {
      setMonthlyBudgets(prev => ({
        ...prev,
        [activeMonth]: prev[activeMonth].filter(b => b.id !== id)
      }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const limitVal = parseInt(formLimit, 10);
    const spentVal = parseInt(formSpent, 10) || 0;

    if (isNaN(limitVal) || limitVal <= 0) {
      alert("Batas anggaran harus berupa angka positif!");
      return;
    }

    if (modalMode === "add") {
      const newBudget = {
        id: Date.now(),
        category: formCategory,
        description: formDescription || "Anggaran bulanan kustom",
        spent: spentVal,
        limit: limitVal,
        iconType: formIcon
      };
      setMonthlyBudgets(prev => ({
        ...prev,
        [activeMonth]: [...prev[activeMonth], newBudget]
      }));
    } else {
      setMonthlyBudgets(prev => ({
        ...prev,
        [activeMonth]: prev[activeMonth].map(b => b.id === editingBudget.id ? {
          ...b,
          category: formCategory,
          description: formDescription,
          spent: spentVal,
          limit: limitVal,
          iconType: formIcon
        } : b)
      }));
    }

    setIsModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Title */}
        <BudgetsHeader 
          isVisible={isVisible}
          activeMonth={activeMonth}
          monthIndex={monthIndex}
          monthsLength={months.length}
          handlePrevMonth={handlePrevMonth}
          handleNextMonth={handleNextMonth}
          viewMode={viewMode}
          setViewMode={setViewMode}
          openAddModal={openAddModal}
        />

        {/* BUDGET CARDS GRID / LIST CONTAINER */}
        <BudgetsGrid 
          viewMode={viewMode}
          monthIndex={monthIndex}
          currentPage={currentPage}
          paginatedBudgets={paginatedBudgets}
          startIndex={startIndex}
          endIndex={endIndex}
          budgetsLength={budgets.length}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          getCategoryIcon={getCategoryIcon}
          openEditModal={openEditModal}
          handleDelete={handleDelete}
        />

        {/* BOTTOM OVERVIEW SECTION */}
        <BudgetsOverview 
          isVisible={isVisible}
          overallPercentage={overallPercentage}
          remainingBudget={remainingBudget}
          totalLimit={totalLimit}
          totalSpent={totalSpent}
          circumference={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </div>

      {/* BUDGET FORM MODAL (Add / Edit) */}
      <BudgetModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalMode={modalMode}
        handleFormSubmit={handleFormSubmit}
        formCategory={formCategory}
        setFormCategory={setFormCategory}
        formDescription={formDescription}
        setFormDescription={setFormDescription}
        formLimit={formLimit}
        setFormLimit={setFormLimit}
        formSpent={formSpent}
        setFormSpent={setFormSpent}
        formIcon={formIcon}
        setFormIcon={setFormIcon}
      />
    </DashboardLayout>
  );
}
