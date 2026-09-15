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
    handleExport,
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

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#00685F] text-white font-bold rounded-xl hover:bg-[#004D46] hover:shadow-lg hover:shadow-[#00685F]/20 transition-all active:scale-95 text-xs sm:text-sm shadow-sm cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t("transactions.add_btn", "Tambah Transaksi")}</span>
          </button>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <TransactionsStats 
          totalIncome={stats.income}
          totalExpenses={stats.expense}
          netCashFlow={stats.net}
          stats={stats}
          isVisible={isVisible} 
        />

        {/* FILTERS & SEARCH ROW */}
        <TransactionsFilters
          categoryIdFilter={categoryIdFilter}
          setCategoryIdFilter={(val) => { setCategoryIdFilter(val); setPage(1); }}
          accountFilter={accountFilter}
          setAccountFilter={(val) => { setAccountFilter(val); setPage(1); }}
          accountIdFilter={accountFilter}
          setAccountIdFilter={(val) => { setAccountFilter(val); setPage(1); }}
          dateFilter={dateFilter}
          setDateFilter={(val) => { setDateFilter(val); setPage(1); }}
          searchQuery={searchQuery}
          setSearchQuery={(val) => { setSearchQuery(val); setPage(1); }}
          handleExport={handleExport}
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

        {/* Active Search Banner */}
        {searchQuery && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-brand-50/70 border border-brand-200/80 px-4 py-3 rounded-2xl text-xs text-brand-900 shadow-xs animate-fadeIn">
            <div className="flex items-center gap-2 min-w-0">
              <Search className="w-4 h-4 text-brand-600 shrink-0" />
              <span className="truncate">
                {language === "en" ? "Showing search result for:" : "Menampilkan hasil pencarian untuk:"}{" "}
                <span className="font-bold text-slate-900">&ldquo;{searchQuery}&rdquo;</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setDateFilter("last_30_days");
                setPage(1);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-brand-100/60 text-brand-700 hover:text-brand-900 font-bold rounded-xl border border-brand-200 transition-all text-xs shrink-0 cursor-pointer shadow-xs active:scale-95"
            >
              <X className="w-3.5 h-3.5" />
              {language === "en" ? "Show All Transactions" : "Tampilkan Semua Transaksi"}
            </button>
          </div>
        )}

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
