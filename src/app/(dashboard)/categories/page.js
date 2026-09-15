"use client";

import { Suspense } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import CategoriesHeader from "../../../components/categories/CategoriesHeader";
import CategoriesTabs from "../../../components/categories/CategoriesTabs";
import CategoriesGrid from "../../../components/categories/CategoriesGrid";
import CategoriesStats from "../../../components/categories/CategoriesStats";
import CategoryModal from "../../../components/categories/CategoryModal";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { CheckCircle2, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { useCategoriesPage } from "../../../components/categories/hooks/useCategoriesPage";

function CategoriesPageContent() {
  const {
    router,
    language,
    t,
    isVisible,
    searchQuery,
    clearSearch,
    categories,
    activeTab,
    viewMode,
    currentPage,
    totalPages,
    paginatedCategories,
    showCreateCard,
    isTransitioning,
    handleTabChange,
    handleViewModeChange,
    handlePageChange,
    activeCategoriesCount,
    highestCategory,
    toastMessage,
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
    isConfirmOpen,
    setIsConfirmOpen,
    handleDeleteClick,
    handleConfirmDelete,
    deletingCategory,
    isDeleting,
  } = useCategoriesPage();

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
                <span className="font-bold text-slate-900">&ldquo;{searchQuery}&rdquo;</span>
              </span>
            </div>
            <button
              onClick={clearSearch}
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
