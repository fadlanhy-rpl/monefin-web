"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import BudgetsHeader from "../../../components/budgets/BudgetsHeader";
import BudgetsGrid from "../../../components/budgets/BudgetsGrid";
import BudgetsOverview from "../../../components/budgets/BudgetsOverview";
import BudgetModal from "../../../components/budgets/BudgetModal";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { Utensils, Car, ShoppingBag, Zap, Film, PiggyBank, Info, Hash } from "lucide-react";
import { getBudgets, createBudget, updateBudget, deleteBudget } from "../../../services/budget.service";
import { getCategories } from "../../../services/category.service";
import { notifySuccess, notifyError } from "../../../lib/notify";
import { useLanguage } from "../../../context/LanguageContext";

// Helper to get category icon component
function getCategoryIcon(iconType) {
  switch (iconType) {
    case "utensils": return <Utensils className="w-6 h-6" />;
    case "car": return <Car className="w-6 h-6" />;
    case "shopping-bag": return <ShoppingBag className="w-6 h-6" />;
    case "zap": return <Zap className="w-6 h-6" />;
    case "film": return <Film className="w-6 h-6" />;
    case "piggy-bank": return <PiggyBank className="w-6 h-6" />;
    default: return <Hash className="w-6 h-6" />;
  }
}

export default function BudgetsPage() {
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [viewMode, setViewMode] = useState("card"); // "card" | "list"
  
  // Date state
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Data states
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingBudgetId, setDeletingBudgetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const m = currentDate.getMonth() + 1;
      const y = currentDate.getFullYear();
      
      const [budgetsRes, categoriesRes] = await Promise.all([
        getBudgets(m, y),
        getCategories('expense')
      ]);
      
      // Map API data to UI structure
      const formattedBudgets = budgetsRes.data.map(b => ({
        id: b.id,
        category_id: b.category_id,
        category: b.category.name,
        description: b.category.description || (t("sidebar.budgets") || "Anggaran"),
        spent: parseFloat(b.spent_amount) || 0,
        limit: parseFloat(b.limit_amount) || 0,
        iconType: b.category.icon
      }));
      
      setBudgets(formattedBudgets);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      notifyError(language === 'en' ? "Failed to load budget data" : "Gagal memuat data anggaran");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsVisible(true);
    fetchData();
  }, [currentDate]);

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

  // Calculation summaries
  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const remainingBudget = Math.max(0, totalLimit - totalSpent);
  const overallPercentage = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;
  
  // Donut chart parameters
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * Math.min(overallPercentage, 100)) / 100;

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [editingBudget, setEditingBudget] = useState(null);

  // Form states
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formLimit, setFormLimit] = useState("");

  // Handlers for month change
  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
    setCurrentPage(1);
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
    setCurrentPage(1);
  };

  const activeMonthStr = currentDate.toLocaleString(language === 'en' ? 'en-US' : 'id-ID', { month: 'long', year: 'numeric' });

  // Open Modal triggers
  const openAddModal = () => {
    setModalMode("add");
    setEditingBudget(null);
    setFormCategoryId("");
    setFormLimit("");
    setIsModalOpen(true);
  };

  const openEditModal = (b) => {
    setModalMode("edit");
    setEditingBudget(b);
    setFormCategoryId(b.category_id);
    setFormLimit(String(b.limit));
    setIsModalOpen(true);
  };

  // Open custom delete modal
  const openDeleteModal = (id) => {
    setDeletingBudgetId(id);
    setIsDeleteModalOpen(true);
  };

  // Perform delete API call
  const confirmDelete = async () => {
    if (!deletingBudgetId) return;
    try {
      setIsDeleting(true);
      await deleteBudget(deletingBudgetId);
      notifySuccess(language === 'en' ? "Budget deleted successfully" : "Anggaran berhasil dihapus");
      setIsDeleteModalOpen(false);
      setDeletingBudgetId(null);
      fetchData();
    } catch (error) {
      notifyError(language === 'en' ? "Failed to delete budget" : "Gagal menghapus anggaran");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const limitVal = parseFloat(formLimit);

    if (isNaN(limitVal) || limitVal <= 0 || !formCategoryId) {
      notifyError(language === 'en' ? "Invalid data!" : "Data tidak valid!");
      return;
    }

    try {
      if (modalMode === "add") {
        await createBudget({
          category_id: formCategoryId,
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear(),
          limit_amount: limitVal
        });
        notifySuccess(language === 'en' ? "New budget added successfully" : "Anggaran baru berhasil ditambahkan");
      } else {
        await updateBudget(editingBudget.id, {
          limit_amount: limitVal
        });
        notifySuccess(language === 'en' ? "Budget updated successfully" : "Anggaran berhasil diperbarui");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      notifyError(error?.data?.message || error?.message || (language === 'en' ? "An error occurred while saving" : "Terjadi kesalahan saat menyimpan"));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Title */}
        <BudgetsHeader 
          isVisible={isVisible}
          activeMonth={activeMonthStr}
          monthIndex={currentDate.getMonth()}
          monthsLength={12}
          handlePrevMonth={handlePrevMonth}
          handleNextMonth={handleNextMonth}
          viewMode={viewMode}
          setViewMode={setViewMode}
          openAddModal={openAddModal}
        />

        {/* BUDGET CARDS GRID / LIST CONTAINER */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20 text-slate-400 font-medium">
            {language === 'en' ? "Loading Budget Data..." : "Memuat Data Anggaran..."}
          </div>
        ) : (
          <BudgetsGrid 
            viewMode={viewMode}
            monthIndex={currentDate.getMonth()}
            currentPage={currentPage}
            paginatedBudgets={paginatedBudgets}
            startIndex={startIndex}
            endIndex={endIndex}
            budgetsLength={budgets.length}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            getCategoryIcon={getCategoryIcon}
            openEditModal={openEditModal}
            handleDelete={openDeleteModal}
          />
        )}

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
        formCategoryId={formCategoryId}
        setFormCategoryId={setFormCategoryId}
        formLimit={formLimit}
        setFormLimit={setFormLimit}
        categories={categories}
      />

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingBudgetId(null);
        }}
        onConfirm={confirmDelete}
        title={t("budgets.delete_title") || "Hapus Anggaran?"}
        message={t("budgets.delete_desc") || "Apakah Anda yakin ingin menghapus anggaran ini? Batas pengeluaran bulanan untuk kategori ini akan dihapus."}
        confirmText={t("budgets.delete_confirm") || "Ya, Hapus"}
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
}
