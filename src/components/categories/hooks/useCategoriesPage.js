"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from "../../../services/category.service";
import { useLanguage } from "../../../context/LanguageContext";

export function useCategoriesPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const isVisible = true;
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search");
  const [searchQuery, setSearchQuery] = useState(() => urlSearch || "");

  // Categories list state
  const [categories, setCategories] = useState([]);

  // Tab State: "expense" | "income"
  const [activeTab, setActiveTab] = useState("expense");

  // View Mode: "card" | "list"
  const [viewMode, setViewMode] = useState("card");

  // Pagination States (max 8 actual categories per page)
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const itemsPerPage = 8;

  // Sync with searchParams
  useEffect(() => {
    if (urlSearch !== null && urlSearch !== undefined) {
      const timer = setTimeout(() => {
        setSearchQuery(urlSearch);
        if (urlSearch.trim()) {
          const found = categories.find(c => c.name?.toLowerCase().includes(urlSearch.toLowerCase()));
          if (found?.type) {
            setActiveTab(found.type);
          }
        }
        setCurrentPage(1);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [urlSearch, categories]);

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
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  // Slice categories for the current page
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

  // Show "Buat Kategori" card only on the last page
  const showCreateCard = safeCurrentPage === totalPages;

  // Toast State
  const [toastMessage, setToastMessage] = useState("");

  const showToast = useCallback((message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  }, []);

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

  // Initial Data Fetch
  useEffect(() => {
    let ignore = false;
    async function load() {
      setIsLoading(true);
      try {
        let res = await getCategories();
        if (!Array.isArray(res?.data) || res.data.length === 0) {
          res = await getCategories("", true);
        }
        if (!ignore) {
          setCategories(res?.data || []);
        }
      } catch (error) {
        if (!ignore && error?.status !== 401) {
          console.error("Failed to fetch categories:", error?.message || error);
          showToast("Gagal memuat data kategori.");
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
  }, [showToast]);

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
    setFormTransactions(cat.transactions_count ?? cat.transactions ?? 0);
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

      getCategories("", true)
        .then((fresh) => {
          if (Array.isArray(fresh?.data) && fresh.data.length > 0) {
            setCategories(fresh.data);
          }
        })
        .catch(() => {});
      
      showToast(language === 'en' ? `Category "${deletingCategory.name}" deleted successfully.` : `Kategori "${deletingCategory.name}" berhasil dihapus.`);
    } catch (error) {
      console.error("Failed to delete category:", error);
      showToast(error?.data?.message || error?.response?.data?.message || error?.message || (language === 'en' ? "Failed to delete category." : "Gagal menghapus kategori."));
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
        const updated = newCategory ? [...categories, newCategory] : categories;
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
        const updated = newCategory
          ? categories.map((c) => (c.id === editingCategory.id ? newCategory : c))
          : categories;
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

      getCategories("", true)
        .then((fresh) => {
          if (Array.isArray(fresh?.data) && fresh.data.length > 0) {
            setCategories(fresh.data);
          }
        })
        .catch(() => {});
    } catch (error) {
      console.error("Failed to save category:", error);
      showToast(error?.data?.message || error?.response?.data?.message || error?.message || "Gagal menyimpan kategori.");
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    router.replace("/categories");
  };

  // Count active categories (categories that have at least 1 transaction)
  const activeCategoriesCount = categories.filter((c) => (c.transactions_count ?? c.transactions ?? 0) > 0).length;

  // Find category with the highest realization for the active tab (expense/income)
  const highestCategory = filteredCategories.length > 0
    ? [...filteredCategories].sort((a, b) => b.realization - a.realization)[0]
    : null;

  return {
    router,
    language,
    t,
    isVisible,
    isLoading,
    searchQuery,
    clearSearch,
    categories,
    activeTab,
    viewMode,
    currentPage: safeCurrentPage,
    totalPages,
    paginatedCategories,
    showCreateCard,
    isTransitioning,
    handleTabChange,
    handleViewModeChange,
    handlePageChange,
    activeCategoriesCount,
    highestCategory,
    // Toast
    toastMessage,
    // Modal
    isModalOpen,
    setIsModalOpen,
    modalMode,
    openAddModal,
    openEditModal,
    handleFormSubmit,
    formName,
    setFormName,
    formDescription,
    setFormDescription,
    formRealization,
    setFormRealization,
    formTransactions,
    setFormTransactions,
    formType,
    setFormType,
    formIcon,
    setFormIcon,
    formColor,
    setFormColor,
    // Confirm delete
    isConfirmOpen,
    setIsConfirmOpen,
    handleDeleteClick,
    handleConfirmDelete,
    deletingCategory,
    isDeleting,
  };
}
