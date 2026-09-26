"use client";

import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import TransactionsStats from "../../../components/transactions/TransactionsStats";
import TransactionsFilters from "../../../components/transactions/TransactionsFilters";
import TransactionsTable from "../../../components/transactions/TransactionsTable";
import TransactionModal from "../../../components/transactions/TransactionModal";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { Plus, Search, X, Camera } from "lucide-react";
import toast from "react-hot-toast";
import { useTransactionsPage } from "../../../components/transactions/hooks/useTransactionsPage";

// Lazy-load: hanya muncul saat user klik "Pindai Struk" — tidak perlu di initial bundle
const ReceiptScannerModal = dynamic(
  () => import("../../../components/receipts/ReceiptScannerModal"),
  { ssr: false }
);
const ReceiptReviewModal = dynamic(
  () => import("../../../components/receipts/ReceiptReviewModal"),
  { ssr: false }
);

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
    fetchTransactionsData,
  } = useTransactionsPage();

  const [isReceiptScannerOpen, setIsReceiptScannerOpen] = useState(false);
  const [isReceiptReviewOpen, setIsReceiptReviewOpen] = useState(false);
  const [extractedReceiptData, setExtractedReceiptData] = useState(null);
  const [receiptImageFile, setReceiptImageFile] = useState(null);
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState(null);
  const [receiptImageFiles, setReceiptImageFiles] = useState([]);
  const [receiptPreviewUrls, setReceiptPreviewUrls] = useState([]);

  const hasFilterActive = Boolean(
    (searchQuery && searchQuery.trim() !== "") ||
    (categoryIdFilter && categoryIdFilter !== "All") ||
    (accountFilter && accountFilter !== "All") ||
    (dateFilter && dateFilter !== "last_30_days" && dateFilter !== "all_time")
  );

  const isInitialEmpty = !searchQuery && categoryIdFilter === "All" && accountFilter === "All" && stats.income === 0 && stats.expense === 0;
  const isFiltered = hasFilterActive && !isInitialEmpty;

  const handleResetFilters = () => {
    setSearchQuery("");
    setCategoryIdFilter("All");
    setAccountFilter("All");
    setDateFilter("all_time");
    setPage(1);
  };

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

          <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
            <button
              onClick={() => setIsReceiptScannerOpen(true)}
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-50 text-[#00685F] border border-teal-200/80 font-bold rounded-xl hover:bg-teal-100 hover:border-[#00685F]/40 transition-all active:scale-95 text-xs sm:text-sm shadow-xs cursor-pointer whitespace-nowrap"
            >
              <Camera className="w-4 h-4 text-[#00685F]" />
              <span>{t("transactions.scan_receipt") || (language === "en" ? "Scan Receipt" : "Pindai Struk")}</span>
            </button>

            <button
              onClick={() => openAddModal("expense")}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#00685F] text-white font-bold rounded-xl hover:bg-[#004D46] hover:shadow-lg hover:shadow-[#00685F]/20 transition-all active:scale-95 text-xs sm:text-sm shadow-sm cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>{t("transactions.add_btn") || (language === "en" ? "Add Transaction" : "Tambah Transaksi")}</span>
            </button>
          </div>
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
          onPageChange={setPage}
          openAddModal={openAddModal}
          openEditModal={openEditModal}
          handleDelete={handleDeleteClick}
          handleDeleteClick={handleDeleteClick}
          isVisible={isVisible}
          onScanReceipt={() => setIsReceiptScannerOpen(true)}
          isFiltered={isFiltered}
          searchQuery={searchQuery}
          onResetFilter={handleResetFilters}
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

        {/* RECEIPT SCANNER MODAL */}
        <ReceiptScannerModal
          isOpen={isReceiptScannerOpen}
          onClose={() => setIsReceiptScannerOpen(false)}
          onScanSuccess={(data, file, previewUrl, allFiles = [], allUrls = []) => {
            setExtractedReceiptData(data);
            setReceiptImageFile(file);
            setReceiptPreviewUrl(previewUrl);
            setReceiptImageFiles(Array.isArray(allFiles) && allFiles.length > 0 ? allFiles : file ? [file] : []);
            setReceiptPreviewUrls(Array.isArray(allUrls) && allUrls.length > 0 ? allUrls : previewUrl ? [previewUrl] : []);
            setIsReceiptReviewOpen(true);
          }}
        />

        {/* RECEIPT REVIEW & CONFIRM MODAL */}
        <ReceiptReviewModal
          isOpen={isReceiptReviewOpen}
          onClose={() => {
            setIsReceiptReviewOpen(false);
            setExtractedReceiptData(null);
            setReceiptImageFile(null);
            setReceiptPreviewUrl(null);
            setReceiptImageFiles([]);
            setReceiptPreviewUrls((prev) => {
              prev.forEach((u) => {
                if (u) URL.revokeObjectURL(u);
              });
              return [];
            });
          }}
          extractedData={extractedReceiptData}
          imageFile={receiptImageFile}
          previewUrl={receiptPreviewUrl}
          imageFiles={receiptImageFiles}
          previewUrls={receiptPreviewUrls}
          accounts={accounts}
          categories={categories}
          onSuccess={() => {
            toast.success(
              language === "en"
                ? "Receipt transaction successfully saved!"
                : "Transaksi dari struk berhasil disimpan!"
            );
            setDateFilter("all_time");
            setPage(1);
            if (fetchTransactionsData) fetchTransactionsData(true);
          }}
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
