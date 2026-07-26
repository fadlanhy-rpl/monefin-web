"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Utensils, 
  Car, 
  ShoppingBag, 
  Zap, 
  Film, 
  PiggyBank, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Sparkles, 
  ArrowRight, 
  Lightbulb,
  Pencil,
  Trash2,
  X
} from "lucide-react";
import { LayoutGrid, List } from "lucide-react";

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
        <div className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
          <div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900">Monthly Budget</h2>
            <p className="text-gray-400 text-sm mt-1">Track your spending efficiency across categories</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* View Switcher Toggle */}
            <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200/50 select-none">
              <button 
                onClick={() => setViewMode("card")}
                className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === "card" ? "bg-white text-[#00685F] shadow-sm font-bold scale-105" : "text-slate-400 hover:text-slate-600"}`}
                title="Tampilan Kartu (Card)"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === "list" ? "bg-white text-[#00685F] shadow-sm font-bold scale-105" : "text-slate-400 hover:text-slate-600"}`}
                title="Tampilan Daftar (List)"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Month Switcher */}
            <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-bold shadow-sm select-none">
              <ChevronLeft 
                className={`w-4 h-4 cursor-pointer transition-colors ${monthIndex === 0 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-slate-700'}`} 
                onClick={handlePrevMonth}
              />
              <span className="px-4 text-slate-700 min-w-[100px] text-center">{activeMonth}</span>
              <ChevronRight 
                className={`w-4 h-4 cursor-pointer transition-colors ${monthIndex === months.length - 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-slate-700'}`} 
                onClick={handleNextMonth}
              />
            </div>

            {/* Set New Budget Button */}
            <button 
              onClick={openAddModal}
              className="press-scale flex items-center gap-2 bg-[#00685F] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#004D46] hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-[#00685F]/20 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Set New Budget
            </button>
          </div>
        </div>

        {/* BUDGET CARDS GRID / LIST CONTAINER */}
        <div className="space-y-6">
          {viewMode === "card" ? (
            <div 
              key={`grid-${monthIndex}-${currentPage}`}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              {paginatedBudgets.map((b, index) => {
                const percent = b.limit > 0 ? (b.spent / b.limit) : 0;
                const percentDisplay = Math.round(percent * 100);
                
                let statusText = "On track";
                let statusIcon = <CheckCircle className="w-3.5 h-3.5" />;
                let badgeBg = "bg-brand-50 text-brand-600";
                let iconBg = "bg-brand-50 text-brand-600";
                let progressBarColor = "bg-[#00685F]";
                let textColor = "text-brand-600";
                
                const isSavingsGoal = b.category.toLowerCase().includes("savings") || b.iconType === "piggy-bank";

                if (percent >= 1.0) {
                  statusText = "Budget exceeded";
                  statusIcon = <AlertTriangle className="w-3.5 h-3.5" />;
                  badgeBg = "bg-red-50 text-red-600 animate-pulse";
                  iconBg = "bg-red-50 text-red-600";
                  progressBarColor = "bg-red-600";
                  textColor = "text-red-600";
                } else if (percent >= 0.85) {
                  statusText = "Almost reached";
                  statusIcon = <AlertCircle className="w-3.5 h-3.5" />;
                  badgeBg = "bg-orange-50 text-orange-600";
                  iconBg = "bg-orange-50 text-orange-600";
                  progressBarColor = "bg-amber-600";
                  textColor = "text-orange-600";
                } else if (percent >= 0.75) {
                  statusText = "Approaching limit";
                  statusIcon = <AlertCircle className="w-3.5 h-3.5" />;
                  badgeBg = "bg-orange-50 text-orange-600";
                  iconBg = "bg-orange-50 text-orange-600";
                  progressBarColor = "bg-amber-600";
                  textColor = "text-orange-600";
                } else if (percent <= 0.35 && !isSavingsGoal) {
                  statusText = "Low utilization";
                  statusIcon = <Info className="w-3.5 h-3.5" />;
                  badgeBg = "bg-slate-100 text-slate-500";
                  iconBg = "bg-slate-50 text-slate-500";
                  progressBarColor = "bg-slate-400";
                  textColor = "text-slate-500";
                } else if (isSavingsGoal) {
                  statusText = percent >= 1.0 ? "Goal reached" : "On track";
                  statusIcon = <Sparkles className="w-3.5 h-3.5" />;
                  badgeBg = "bg-brand-50 text-brand-700 font-extrabold";
                  iconBg = "bg-[#00685F] text-white";
                  progressBarColor = "bg-[#00685F]";
                  textColor = "text-brand-700";
                }

                return (
                  <div 
                    key={b.id} 
                    className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between space-y-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl group relative overflow-hidden"
                  >
                    <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      <button 
                        onClick={() => openEditModal(b)}
                        title="Ubah Anggaran"
                        className="p-1.5 bg-slate-50 border border-slate-100 text-slate-400 hover:text-[#00685F] hover:bg-slate-100 rounded-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(b.id)}
                        title="Hapus Anggaran"
                        className="p-1.5 bg-slate-50 border border-slate-100 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${iconBg}`}>
                        {getCategoryIcon(b.iconType)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-brand-700 transition-colors">{b.category}</h3>
                        <p className="text-xs text-gray-400">{b.description}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-gray-400">Rp {b.spent.toLocaleString('id-ID')} / Rp {b.limit.toLocaleString('id-ID')}</span>
                        <span className={`${textColor} font-black`}>
                          {percent >= 1.0 
                            ? `Over by Rp ${(b.spent - b.limit).toLocaleString('id-ID')}` 
                            : `Rp ${(b.limit - b.spent).toLocaleString('id-ID')} left`
                          }
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden relative">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${progressBarColor}`}
                          style={{ width: `${Math.min(percentDisplay, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg px-2.5 py-1 self-start select-none ${badgeBg}`}>
                      {statusIcon}
                      <span>{statusText} ({percentDisplay}% spent)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* LIST VIEW */
            <div 
              key={`list-${monthIndex}-${currentPage}`}
              className="space-y-3.5 animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              {paginatedBudgets.map((b, index) => {
                const percent = b.limit > 0 ? (b.spent / b.limit) : 0;
                const percentDisplay = Math.round(percent * 100);
                
                let statusText = "On track";
                let statusIcon = <CheckCircle className="w-3.5 h-3.5" />;
                let badgeBg = "bg-brand-50 text-brand-600";
                let iconBg = "bg-brand-50 text-brand-600";
                let progressBarColor = "bg-[#00685F]";
                let textColor = "text-brand-600";
                
                const isSavingsGoal = b.category.toLowerCase().includes("savings") || b.iconType === "piggy-bank";

                if (percent >= 1.0) {
                  statusText = "Budget exceeded";
                  statusIcon = <AlertTriangle className="w-3.5 h-3.5" />;
                  badgeBg = "bg-red-50 text-red-600 animate-pulse";
                  iconBg = "bg-red-50 text-red-600";
                  progressBarColor = "bg-red-600";
                  textColor = "text-red-600";
                } else if (percent >= 0.85) {
                  statusText = "Almost reached";
                  statusIcon = <AlertCircle className="w-3.5 h-3.5" />;
                  badgeBg = "bg-orange-50 text-orange-600";
                  iconBg = "bg-orange-50 text-orange-600";
                  progressBarColor = "bg-amber-600";
                  textColor = "text-orange-600";
                } else if (percent >= 0.75) {
                  statusText = "Approaching limit";
                  statusIcon = <AlertCircle className="w-3.5 h-3.5" />;
                  badgeBg = "bg-orange-50 text-orange-600";
                  iconBg = "bg-orange-50 text-orange-600";
                  progressBarColor = "bg-amber-600";
                  textColor = "text-orange-600";
                } else if (percent <= 0.35 && !isSavingsGoal) {
                  statusText = "Low utilization";
                  statusIcon = <Info className="w-3.5 h-3.5" />;
                  badgeBg = "bg-slate-100 text-slate-500";
                  iconBg = "bg-slate-50 text-slate-500";
                  progressBarColor = "bg-slate-400";
                  textColor = "text-slate-500";
                } else if (isSavingsGoal) {
                  statusText = percent >= 1.0 ? "Goal reached" : "On track";
                  statusIcon = <Sparkles className="w-3.5 h-3.5" />;
                  badgeBg = "bg-brand-50 text-brand-700 font-extrabold";
                  iconBg = "bg-[#00685F] text-white";
                  progressBarColor = "bg-[#00685F]";
                  textColor = "text-brand-700";
                }

                return (
                  <div 
                    key={b.id} 
                    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:shadow-md hover:border-slate-200 group relative"
                  >
                    {/* Left: Icon & Title */}
                    <div className="flex items-center gap-4 min-w-[200px] shrink-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${iconBg}`}>
                        {getCategoryIcon(b.iconType)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-700 transition-colors leading-tight">{b.category}</h4>
                        <p className="text-[11px] text-gray-400 leading-tight mt-0.5">{b.description}</p>
                      </div>
                    </div>

                    {/* Middle: Progress bar */}
                    <div className="flex-1 min-w-[150px] md:px-4 space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold text-slate-400 leading-none">
                        <span>Usage Progress</span>
                        <span className={`${textColor} font-black`}>{percentDisplay}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden relative">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${progressBarColor}`}
                          style={{ width: `${Math.min(percentDisplay, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Right: Amounts & Status Badge */}
                    <div className="flex items-center justify-between md:justify-end gap-6 shrink-0">
                      <div className="text-left md:text-right">
                        <p className="text-xs font-bold text-slate-800">Rp {b.spent.toLocaleString('id-ID')} / Rp {b.limit.toLocaleString('id-ID')}</p>
                        <p className={`text-[10px] font-bold leading-tight mt-0.5 ${textColor}`}>
                          {percent >= 1.0 
                            ? `Over by Rp ${(b.spent - b.limit).toLocaleString('id-ID')}` 
                            : `Rp ${(b.limit - b.spent).toLocaleString('id-ID')} left`
                          }
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider rounded-lg px-2.5 py-1 select-none shrink-0 ${badgeBg}`}>
                          {statusIcon}
                          {statusText}
                        </span>

                        {/* Edit/Delete actions */}
                        <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
                          <button 
                            onClick={() => openEditModal(b)}
                            title="Ubah Anggaran"
                            className="p-1.5 bg-slate-50 border border-slate-100 text-slate-400 hover:text-[#00685F] hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(b.id)}
                            title="Hapus Anggaran"
                            className="p-1.5 bg-slate-50 border border-slate-100 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-4 select-none">
              <p className="text-xs font-bold text-slate-400">
                Showing <span className="text-slate-800">{startIndex + 1}</span> to{" "}
                <span className="text-slate-800">{Math.min(endIndex, budgets.length)}</span> of{" "}
                <span className="text-slate-800">{budgets.length}</span> budgets
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                    currentPage === 1
                      ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 cursor-pointer"
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                    currentPage === totalPages
                      ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 cursor-pointer"
                  }`}
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM OVERVIEW SECTION */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10 transition-all duration-700 delay-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {/* Spending Overview Card */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-center hover:shadow-lg transition-all duration-300 group">
            <div className="flex-1 space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Spending Overview</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                You've spent {overallPercentage}% of your total monthly budget across all categories. You have Rp {remainingBudget.toLocaleString('id-ID')} remaining.
              </p>
              <div className="flex gap-10 pt-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Total Budget</p>
                  <p className="text-xl font-black text-slate-900 mt-1">Rp {totalLimit.toLocaleString('id-ID')}</p>
                </div>
                <div className="border-l border-slate-100 pl-8">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Total Spent</p>
                  <p className="text-xl font-black text-brand-600 mt-1">Rp {totalSpent.toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>
            {/* Donut Chart */}
            <div className="relative w-40 h-40 flex-shrink-0 cursor-pointer transition-transform duration-300 group-hover:scale-105">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                <circle 
                  cx="80" 
                  cy="80" 
                  r="70" 
                  stroke="#00685F" 
                  strokeWidth="12" 
                  fill="transparent" 
                  strokeDasharray={circumference} 
                  strokeDashoffset={strokeDashoffset} 
                  strokeLinecap="round" 
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900">{overallPercentage}%</span>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Spent</span>
              </div>
            </div>
          </div>

          {/* Smart Saving Tip Card */}
          <div className="bg-brand-50/40 p-8 rounded-[2.5rem] border border-brand-100/30 flex gap-6 relative overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <div className="space-y-4 relative z-10">
              <h3 className="text-xl font-bold text-slate-900">Smart Saving Tip</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                Based on your current dining trends, switching to home cooking on weekends could save you Rp 450,000 next month.
              </p>
              <button className="flex items-center gap-2 text-brand-600 font-bold text-sm group cursor-pointer hover:underline">
                Enable Auto-Savings <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-20 text-[#00685F] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12">
              <Lightbulb style={{ width: "160px", height: "160px" }} />
            </div>
          </div>
        </div>
      </div>

      {/* BUDGET FORM MODAL (Add / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900">
                {modalMode === "add" ? "Set New Budget" : "Edit Budget"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {/* Category Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori (Category)</label>
                <input
                  type="text"
                  required
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-bold text-slate-800"
                  placeholder="Contoh: Transportasi, Investasi"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deskripsi (Description)</label>
                <input
                  type="text"
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-semibold text-slate-800"
                  placeholder="Keterangan singkat anggaran..."
                />
              </div>

              {/* Limit */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Batas Anggaran (Limit)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center font-black text-slate-400">Rp</span>
                  <input
                    type="number"
                    required
                    value={formLimit}
                    onChange={(e) => setFormLimit(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-black text-slate-800"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Spent */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Telah Digunakan (Spent)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center font-black text-slate-400">Rp</span>
                  <input
                    type="number"
                    value={formSpent}
                    onChange={(e) => setFormSpent(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-black text-slate-800"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Icon Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pilih Ikon (Icon)</label>
                <div className="grid grid-cols-6 gap-2">
                  {[
                    { type: "utensils", icon: <Utensils className="w-5 h-5" /> },
                    { type: "car", icon: <Car className="w-5 h-5" /> },
                    { type: "shopping-bag", icon: <ShoppingBag className="w-5 h-5" /> },
                    { type: "zap", icon: <Zap className="w-5 h-5" /> },
                    { type: "film", icon: <Film className="w-5 h-5" /> },
                    { type: "piggy-bank", icon: <PiggyBank className="w-5 h-5" /> }
                  ].map((item) => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setFormIcon(item.type)}
                      className={`p-2.5 border rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                        formIcon === item.type 
                          ? "bg-brand-50 border-[#00685F] text-[#00685F] font-bold" 
                          : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-[#00685F] text-white rounded-2xl font-bold text-sm hover:bg-[#004D46] hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
