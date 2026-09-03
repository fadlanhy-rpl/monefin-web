"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import CategoriesHeader from "../../../components/categories/CategoriesHeader";
import CategoriesTabs from "../../../components/categories/CategoriesTabs";
import CategoriesGrid from "../../../components/categories/CategoriesGrid";
import CategoriesStats from "../../../components/categories/CategoriesStats";
import CategoryModal from "../../../components/categories/CategoryModal";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { CheckCircle2, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../../services/category.service";
import { useLanguage } from "../../../context/LanguageContext";

function CategoriesPageContent() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") || "");

  // Categories list state
  const [categories, setCategories] = useState([]);

  // Tab State: "expense" | "income"
  const [activeTab, setActiveTab] = useState("expense");

  // Sync with searchParams
  useEffect(() => {
    const q = searchParams.get("search");
    if (q !== null && q !== undefined) {
      setSearchQuery(q);
      if (q.trim()) {
        const found = categories.find(c => c.name?.toLowerCase().includes(q.toLowerCase()));
        if (found?.type) {
          setActiveTab(found.type);
        }
      }
      setCurrentPage(1);
    }
  }, [searchParams, categories]);

  // View Mode: "card" | "list"
  const [viewMode, setViewMode] = useState("card");

  // Pagination States (max 8 actual categories per page)
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const itemsPerPage = 8;

  // Filtered Categories based on current tab & search
  const filteredCategories = categories.filter((c) => {
    const matchTab = c.type === activeTab;
    const matchSearch = !searchQuery.trim() || 
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  // Total pages based on actual categories (8 per page)
  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / itemsPerPage));

  // Slice categories for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

  // Show "Buat Kategori" card only on the last page
  const showCreateCard = currentPage === totalPages;

  // Toast State
  const [toastMessage, setToastMessage] = useState("");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [editingCategory, setEditingCategory] = useState(null);

  // Confirm Modal State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form States
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formRealization, setFormRealization] = useState(0);
  const [formTransactions, setFormTransactions] = useState(0);
  const [formType, setFormType] = useState("expense");
  const [formIcon, setFormIcon] = useState("utensils");
  const [formColor, setFormColor] = useState("primary");

  // Entrance animations & Fetch Data
  useEffect(() => {
    setIsVisible(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data || []);
    } catch (error) {
      if (error?.status !== 401) {
        console.error("Failed to fetch categories:", error.message || error);
        showToast("Gagal memuat data kategori.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset pagination on tab change with transition
  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(tab);
      setCurrentPage(1);
      setIsTransitioning(false);
    }, 200);
  };

  // Change view mode with transition
  const handleViewModeChange = (mode) => {
    if (mode === viewMode) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setViewMode(mode);
      setIsTransitioning(false);
    }, 200);
  };

  // Handle page change with transition
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsTransitioning(false);
    }, 200);
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  // Open modal in Create mode
  const openAddModal = () => {
    setModalMode("add");
    setEditingCategory(null);
    setFormName("");
    setFormDescription("");
    setFormRealization(0);
    setFormTransactions(0);
    setFormType(activeTab); // match current tab
    setFormIcon("utensils");
    setFormColor("primary");
    setIsModalOpen(true);
  };

  // Open modal in Edit mode
  const openEditModal = (cat) => {
    setModalMode("edit");
    setEditingCategory(cat);
    setFormName(cat.name || "");
    setFormDescription(cat.description || "");
    setFormRealization(cat.realization || 0);
    setFormTransactions(cat.transactions || 0);
    setFormType(cat.type || "expense");
    setFormIcon(cat.icon || "utensils");
    setFormColor(cat.color || "primary");
    setIsModalOpen(true);
  };

  // Delete Category
  const handleDeleteClick = (id) => {
    const target = categories.find((c) => c.id === id);
    if (!target) return;
    setDeletingCategory(target);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    try {
      await deleteCategory(deletingCategory.id);
      
      const updatedCategories = categories.filter((c) => c.id !== deletingCategory.id);
      setCategories(updatedCategories);
      
      // Handle page overflow after deletion
      const newFilteredCount = updatedCategories.filter((c) => c.type === activeTab).length;
      const newTotalPages = Math.max(1, Math.ceil(newFilteredCount / itemsPerPage));
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }
      
      showToast(language === 'en' ? `Category "${deletingCategory.name}" deleted successfully.` : `Kategori "${deletingCategory.name}" berhasil dihapus.`);
    } catch (error) {
      console.error("Failed to delete category:", error);
      showToast(error?.response?.data?.message || (language === 'en' ? "Failed to delete category." : "Gagal menghapus kategori."));
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setDeletingCategory(null);
    }
  };

  // Handle Form Submit (Add/Edit)
  const handleFormSubmit = async () => {
    if (!formName.trim()) return;

    const categoryData = {
      name: formName,
      description: formDescription,
      type: formType,
      icon: formIcon,
      color: formColor
    };

    try {
      if (modalMode === "add") {
        const res = await createCategory(categoryData);
        const newCategory = res.data;
        const updated = [...categories, newCategory];
        setCategories(updated);
        
        // Switch tab and jump to the page containing the new item
        setIsTransitioning(true);
        setTimeout(() => {
          setActiveTab(formType);
          const newFiltered = updated.filter((c) => c.type === formType);
          const newTotalPages = Math.max(1, Math.ceil(newFiltered.length / itemsPerPage));
          setCurrentPage(newTotalPages);
          setIsTransitioning(false);
        }, 200);
        
        showToast(`Kategori "${formName}" berhasil ditambahkan.`);
      } else if (modalMode === "edit" && editingCategory) {
        const res = await updateCategory(editingCategory.id, categoryData);
        const newCategory = res.data;
        const updated = categories.map((c) =>
          c.id === editingCategory.id ? newCategory : c
        );
        setCategories(updated);
        
        setIsTransitioning(true);
        setTimeout(() => {
          setActiveTab(formType);
          // Recalculate page location if category type changed
          if (editingCategory.type !== formType) {
            const newFiltered = updated.filter((c) => c.type === formType);
            const newTotalPages = Math.max(1, Math.ceil(newFiltered.length / itemsPerPage));
            setCurrentPage(newTotalPages);
          }
          setIsTransitioning(false);
        }, 200);

        showToast(`Kategori "${formName}" berhasil diperbarui.`);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save category:", error);
      showToast(error?.response?.data?.message || "Gagal menyimpan kategori.");
    }
  };

  // Count active categories (categories that have at least 1 transaction)
  const activeCategoriesCount = categories.filter((c) => c.transactions > 0).length;

  // Find category with the highest realization for the active tab (expense/income)
  const highestCategory = filteredCategories.length > 0
    ? [...filteredCategories].sort((a, b) => b.realization - a.realization)[0]
    : null;

  return (
    <DashboardLayout>
      <div className="space-y-8 min-w-0">
        
        {/* Header Title Section */}
        <CategoriesHeader 
          isVisible={isVisible}
          openAddModal={openAddModal}
        />

        {/* Active Search Banner */}
        {searchQuery && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-brand-50/70 border border-brand-200/80 px-4 py-3 rounded-2xl text-xs text-brand-900 shadow-xs animate-fadeIn">
            <div className="flex items-center gap-2 min-w-0">
              <Search className="w-4 h-4 text-brand-600 shrink-0" />
              <span className="truncate">
                {language === 'en' ? 'Showing search result for:' : 'Menampilkan hasil pencarian untuk:'}{' '}
                <span className="font-bold text-slate-900">"{searchQuery}"</span>
              </span>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                router.replace("/categories");
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-brand-100/60 text-brand-700 hover:text-brand-900 font-bold rounded-xl border border-brand-200 transition-all text-xs shrink-0 cursor-pointer shadow-xs active:scale-95"
            >
              <X className="w-3.5 h-3.5" />
              {language === 'en' ? 'Show All Categories' : 'Tampilkan Semua Kategori'}
            </button>
          </div>
        )}

        {/* Tab Switcher & View Switcher */}
        <div className={`transition-all duration-700 delay-100 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <CategoriesTabs 
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            viewMode={viewMode}
            setViewMode={handleViewModeChange}
          />
        </div>

        {/* Grid Category Cards / Sleek List */}
        <div className="relative min-h-[300px]">
          <CategoriesGrid 
            categories={paginatedCategories}
            openEditModal={openEditModal}
            handleDelete={handleDeleteClick}
            openAddModal={openAddModal}
            viewMode={viewMode}
            showCreateCard={showCreateCard}
            isTransitioning={isTransitioning}
          />
        </div>

        {/* Pagination Control (Hidden if only 1 page is needed) */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 select-none pt-4 transition-all duration-500 animate-in fade-in">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2.5 rounded-2xl border border-slate-100 bg-white transition-all ${
                currentPage === 1 
                  ? "opacity-40 cursor-not-allowed text-slate-300" 
                  : "text-slate-600 hover:bg-slate-50 active:scale-95 cursor-pointer shadow-sm"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="text-xs font-bold text-slate-700 bg-white px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
              Page <span className="text-[#00685F] font-black">{currentPage}</span> of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2.5 rounded-2xl border border-slate-100 bg-white transition-all ${
                currentPage === totalPages 
                  ? "opacity-40 cursor-not-allowed text-slate-300" 
                  : "text-slate-600 hover:bg-slate-50 active:scale-95 cursor-pointer shadow-sm"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Dynamic Analytics & Statistics Section */}
        <div className={`transition-all duration-700 delay-400 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <CategoriesStats 
            totalCategories={categories.length}
            activeCategoriesCount={activeCategoriesCount}
            onViewReportClick={() => router.push("/reports")}
            activeTab={activeTab}
            highestCategory={highestCategory}
          />
        </div>

      </div>

      {/* Dynamic Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-5 duration-300 z-50 border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Category Modal (Add / Edit) */}
      <CategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        modalMode={modalMode}
        formName={formName}
        setFormName={setFormName}
        formDescription={formDescription}
        setFormDescription={setFormDescription}
        formRealization={formRealization}
        setFormRealization={setFormRealization}
        formTransactions={formTransactions}
        setFormTransactions={setFormTransactions}
        formType={formType}
        setFormType={setFormType}
        formIcon={formIcon}
        setFormIcon={setFormIcon}
        formColor={formColor}
        setFormColor={setFormColor}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t("categories.delete_title") || (language === 'en' ? "Delete Category?" : "Hapus Kategori?")}
        message={language === 'en' 
          ? `Are you sure you want to delete category "${deletingCategory?.name || ''}"? Associated analytics will be adjusted.`
          : `Apakah Anda yakin ingin menghapus kategori "${deletingCategory?.name || ''}"? Seluruh statistik terkait kategori ini akan disesuaikan.`}
        confirmText={language === 'en' ? "Yes, Delete" : "Ya, Hapus"}
        cancelText={language === 'en' ? "Cancel" : "Batal"}
        isLoading={isDeleting}
      />

    </DashboardLayout>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={null}>
      <CategoriesPageContent />
    </Suspense>
  );
}
