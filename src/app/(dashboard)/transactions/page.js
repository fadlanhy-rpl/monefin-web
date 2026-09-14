"use client";

import { Suspense } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import TransactionsStats from "../../../components/transactions/TransactionsStats";
import TransactionsFilters from "../../../components/transactions/TransactionsFilters";
import TransactionsTable from "../../../components/transactions/TransactionsTable";
import TransactionModal from "../../../components/transactions/TransactionModal";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { Plus, Search, X } from "lucide-react";
import { useTransactionsPage } from "../../../components/transactions/hooks/useTransactionsPage";

function TransactionsPageContent() {
  const {
    t,
    language,
    categoryIdFilter,
    setCategoryIdFilter,
    accountFilter,
    setAccountFilter,
    dateFilter,
    setDateFilter,
    searchQuery,
    setSearchQuery,
    isVisible,
    page,
    setPage,
    isCategoryOpen,
    setIsCategoryOpen,
    isDateOpen,
    setIsDateOpen,
    isAccountOpen,
    setIsAccountOpen,
    transactions,
    paginationMeta,
    categories,
    accounts,
    stats,
    isModalOpen,
    modalMode,
    openAddModal,
    openEditModal,
    closeAddEditModal,
    isConfirmOpen,
    isDeleting,
    handleDeleteClick,
    closeConfirmModal,
    handleConfirmDelete,
    isSubmitting,
    formType,
    setFormType,
    formAmount,
    setFormAmount,
    formCategoryId,
    setFormCategoryId,
    formAccountId,
    setFormAccountId,
    formDate,
    setFormDate,
    formNote,
    setFormNote,
    handleFormSubmit,
  } = useTransactionsPage();

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-12">
        {/* TOP BAR / HEADER */}
        <div className={`transition-all duration-500 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t("transactions.title", "Transactions")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {t("transactions.subtitle", "Track and manage your daily cashflow")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder={t("transactions.search_placeholder", "Cari transaksi...")}
                className="w-full bg-white border border-slate-200/80 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#00685F] focus:ring-1 focus:ring-[#00685F] transition shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#00685F] text-white font-bold rounded-xl hover:bg-[#004D46] hover:shadow-lg hover:shadow-[#00685F]/20 transition-all active:scale-95 text-xs sm:text-sm shadow-sm cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>{t("transactions.add_btn", "Tambah Transaksi")}</span>
            </button>
          </div>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <TransactionsStats stats={stats} isVisible={isVisible} />

        {/* FILTERS & SEARCH ROW */}
        <TransactionsFilters
          categoryIdFilter={categoryIdFilter}
          setCategoryIdFilter={setCategoryIdFilter}
          accountFilter={accountFilter}
          setAccountFilter={setAccountFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          setPage={setPage}
          categories={categories}
          accounts={accounts}
          isCategoryOpen={isCategoryOpen}
          setIsCategoryOpen={setIsCategoryOpen}
          isDateOpen={isDateOpen}
          setIsDateOpen={setIsDateOpen}
          isAccountOpen={isAccountOpen}
          setIsAccountOpen={setIsAccountOpen}
          isVisible={isVisible}
        />

        {/* TRANSACTIONS DATA TABLE */}
        <TransactionsTable
          transactions={transactions}
          paginationMeta={paginationMeta}
          page={page}
          setPage={setPage}
          openAddModal={openAddModal}
          openEditModal={openEditModal}
          handleDeleteClick={handleDeleteClick}
          isVisible={isVisible}
        />

        {/* TRANSACTION ADD/EDIT MODAL */}
        <TransactionModal
          isOpen={isModalOpen}
          onClose={closeAddEditModal}
          modalMode={modalMode}
          formType={formType}
          setFormType={setFormType}
          formAmount={formAmount}
          setFormAmount={setFormAmount}
          formCategoryId={formCategoryId}
          setFormCategoryId={setFormCategoryId}
          formAccountId={formAccountId}
          setFormAccountId={setFormAccountId}
          formDate={formDate}
          setFormDate={setFormDate}
          formNote={formNote}
          setFormNote={setFormNote}
          handleFormSubmit={handleFormSubmit}
          categories={categories}
          accounts={accounts}
          isSubmitting={isSubmitting}
        />

        {/* CONFIRM DELETE MODAL */}
        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={closeConfirmModal}
          onConfirm={handleConfirmDelete}
          title={language === "en" ? "Delete Transaction?" : "Hapus Transaksi?"}
          message={language === "en" ? "Are you sure you want to delete this transaction? This action cannot be undone." : "Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan."}
          confirmText={language === "en" ? "Delete" : "Hapus"}
          cancelText={language === "en" ? "Cancel" : "Batal"}
          isLoading={isDeleting}
        />
      </div>
    </DashboardLayout>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 text-sm">Loading...</div>}>
      <TransactionsPageContent />
    </Suspense>
  );
}
