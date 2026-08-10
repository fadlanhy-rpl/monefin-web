"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import CategoriesHeader from "../../../components/categories/CategoriesHeader";
import CategoriesTabs from "../../../components/categories/CategoriesTabs";
import CategoriesGrid from "../../../components/categories/CategoriesGrid";
import CategoriesStats from "../../../components/categories/CategoriesStats";
import CategoryModal from "../../../components/categories/CategoryModal";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

export default function CategoriesPage() {
  const [isVisible, setIsVisible] = useState(false);

  // Categories list state (pre-populated with mock data from categories.html)
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Makanan & Minuman",
      description: "Restoran, kafe, dan bahan makanan bulanan.",
      transactions: 42,
      realization: 75,
      type: "expense",
      icon: "utensils",
      color: "orange"
    },
    {
      id: 2,
      name: "Transportasi",
      description: "Bahan bakar, parkir, dan transportasi umum.",
      transactions: 18,
      realization: 30,
      type: "expense",
      icon: "car",
      color: "blue"
    },
    {
      id: 3,
      name: "Belanja",
      description: "Pakaian, hobi, dan kebutuhan gaya hidup.",
      transactions: 24,
      realization: 92,
      type: "expense",
      icon: "shopping",
      color: "purple"
    },
    {
      id: 4,
      name: "Hiburan",
      description: "Film, konser, dan langganan digital.",
      transactions: 12,
      realization: 45,
      type: "expense",
      icon: "film",
      color: "pink"
    },
    {
      id: 5,
      name: "Kesehatan",
      description: "Obat-obatan, dokter, dan asuransi.",
      transactions: 5,
      realization: 15,
      type: "expense",
      icon: "medical",
      color: "emerald"
    },
    {
      id: 6,
      name: "Rumah Tangga",
      description: "Listrik, air, dan pemeliharaan rumah.",
      transactions: 31,
      realization: 62,
      type: "expense",
      icon: "home",
      color: "teal"
    },
    {
      id: 7,
      name: "Pendidikan",
      description: "Kursus online, buku, dan biaya sekolah.",
      transactions: 8,
      realization: 50,
      type: "expense",
      icon: "graduation",
      color: "amber"
    },
    // Income Categories
    {
      id: 101,
      name: "Gaji Utama",
      description: "Gaji bulanan dari pekerjaan tetap.",
      transactions: 1,
      realization: 100,
      type: "income",
      icon: "briefcase",
      color: "primary"
    },
    {
      id: 102,
      name: "Freelance",
      description: "Proyek sampingan dan pekerjaan lepas.",
      transactions: 3,
      realization: 60,
      type: "income",
      icon: "dollar",
      color: "emerald"
    },
    {
      id: 103,
      name: "Investasi",
      description: "Dividen saham, bunga reksa dana, dll.",
      transactions: 2,
      realization: 40,
      type: "income",
      icon: "trending",
      color: "orange"
    }
  ]);

  // Tab State: "expense" | "income"
  const [activeTab, setActiveTab] = useState("expense");

  // View Mode: "card" | "list"
  const [viewMode, setViewMode] = useState("card");

  // Pagination States (max 8 actual categories per page)
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const itemsPerPage = 8;

  // Filtered Categories based on current tab
  const filteredCategories = categories.filter((c) => c.type === activeTab);

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

  // Form States
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formRealization, setFormRealization] = useState(0);
  const [formTransactions, setFormTransactions] = useState(0);
  const [formType, setFormType] = useState("expense");
  const [formIcon, setFormIcon] = useState("utensils");
  const [formColor, setFormColor] = useState("primary");

  // Entrance animations
  useEffect(() => {
    setIsVisible(true);
  }, []);

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
    setFormName(cat.name);
    setFormDescription(cat.description);
    setFormRealization(cat.realization);
    setFormTransactions(cat.transactions);
    setFormType(cat.type);
    setFormIcon(cat.icon);
    setFormColor(cat.color);
    setIsModalOpen(true);
  };

  // Delete Category
  const handleDeleteClick = (id) => {
    const target = categories.find((c) => c.id === id);
    if (!target) return;
    setDeletingCategory(target);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingCategory) return;
    const updatedCategories = categories.filter((c) => c.id !== deletingCategory.id);
    setCategories(updatedCategories);
    
    // Handle page overflow after deletion
    const newFilteredCount = updatedCategories.filter((c) => c.type === activeTab).length;
    const newTotalPages = Math.max(1, Math.ceil(newFilteredCount / itemsPerPage));
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
    
    showToast(`Kategori "${deletingCategory.name}" berhasil dihapus.`);
    setIsConfirmOpen(false);
    setDeletingCategory(null);
  };

  // Quick Simulation Transaction Incrementor
  const handleQuickTransaction = (id) => {
    const updated = categories.map((c) => {
      if (c.id === id) {
        const nextRealization = Math.min(c.realization + 5, 100);
        showToast(`Simulasi Transaksi: Kategori "${c.name}" +1 Transaksi (+5% Realisasi)`);
        return {
          ...c,
          transactions: c.transactions + 1,
          realization: nextRealization
        };
      }
      return c;
    });
    setCategories(updated);
  };

  // Handle Form Submit (Add/Edit)
  const handleFormSubmit = () => {
    if (!formName.trim()) return;

    if (modalMode === "add") {
      const newCategory = {
        id: Date.now(),
        name: formName,
        description: formDescription,
        transactions: formTransactions,
        realization: formRealization,
        type: formType,
        icon: formIcon,
        color: formColor
      };
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
      const updated = categories.map((c) =>
        c.id === editingCategory.id
          ? {
              ...c,
              name: formName,
              description: formDescription,
              transactions: formTransactions,
              realization: formRealization,
              type: formType,
              icon: formIcon,
              color: formColor
            }
          : c
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
            handleQuickTransaction={handleQuickTransaction}
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
            onViewReportClick={() => showToast("Membuka laporan analisis mingguan...")}
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
        title="Hapus Kategori?"
        message={`Apakah Anda yakin ingin menghapus kategori "${deletingCategory?.name || ''}"? Seluruh statistik terkait kategori ini akan disesuaikan.`}
        confirmText="Ya, Hapus"
      />

    </DashboardLayout>
  );
}
