"use client";

import { Plus, RefreshCcw, Sparkles } from "lucide-react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import RecurringModal from "../../../components/recurring/RecurringModal";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import RecurringMetricsSummary from "../../../components/recurring/RecurringMetricsSummary";
import RecurringFilterBar from "../../../components/recurring/RecurringFilterBar";
import RecurringCardItem from "../../../components/recurring/RecurringCardItem";
import RecurringEmptyState from "../../../components/recurring/RecurringEmptyState";
import { useRecurringManager } from "../../../components/recurring/hooks/useRecurringManager";

export default function RecurringPage() {
  const {
    t,
    isEn,
    isLoading,
    isSaving,
    settings,
    accounts,
    categories,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    freqFilter,
    setFreqFilter,
    statusFilter,
    setStatusFilter,
    resetFilters,
    metrics,
    filteredSettings,
    getNextRunInfo,
    handleToggleActive,
    isModalOpen,
    modalMode,
    formState,
    setFormState,
    openAddModal,
    openEditModal,
    closeModal,
    isDeleteModalOpen,
    openDeleteModal,
    closeDeleteModal,
    isDeleting,
    handleApplyStarter,
    handleFormSubmit,
    confirmDelete,
  } = useRecurringManager();

  const periodLabels = {
    daily: t("recurring.frequency_daily") || (isEn ? "Daily" : "Harian"),
    weekly: t("recurring.frequency_weekly") || (isEn ? "Weekly" : "Mingguan"),
    monthly: t("recurring.frequency_monthly") || (isEn ? "Monthly" : "Bulanan"),
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 min-w-0 pb-16 max-w-7xl mx-auto">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-500 ease-out">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00685F]/10 text-[#00685F] text-[11px] font-extrabold tracking-wide border border-[#00685F]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00685F] animate-pulse" />
                {isEn ? "Cash Flow Automation" : "Otomasi Arus Kas"}
              </span>
              
              {settings.length > 0 && (
                <span className="text-[11px] font-bold text-slate-400">
                  {settings.length} {isEn ? "schedules registered" : "jadwal terdaftar"}
                </span>
              )}
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5">
              {t("recurring.title") || (isEn ? "Recurring Transactions" : "Transaksi Rutin")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              {t("recurring.subtitle") || (isEn ? "Automate scheduled income and expense tracking with smart triggers" : "Catat pemasukan dan pengeluaran secara otomatis sesuai jadwal berkala.")}
            </p>
          </div>
          
          <button
            type="button"
            onClick={openAddModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#00685F] text-white font-black text-sm rounded-2xl hover:bg-[#004D46] shadow-sm hover:shadow-lg hover:shadow-[#00685F]/25 transition-all duration-200 active:scale-95 shrink-0 cursor-pointer min-h-[46px]"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>{t("recurring.add_button") || (isEn ? "Add Recurring Schedule" : "Tambah Jadwal Rutin")}</span>
          </button>
        </div>

        {/* ================= METRIC PROJECTION BAR ================= */}
        <RecurringMetricsSummary metrics={metrics} />

        {/* ================= FILTER & SEARCH CONTROLS ================= */}
        <RecurringFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          freqFilter={freqFilter}
          setFreqFilter={setFreqFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* ================= MAIN CONTENT LIST ================= */}
        <div className="transition-all duration-500 delay-200 ease-out relative z-10">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-slate-100" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-4 bg-slate-100 rounded-lg w-2/3" />
                      <div className="h-3 bg-slate-100 rounded-md w-1/3" />
                    </div>
                  </div>
                  <div className="h-10 bg-slate-50 rounded-2xl" />
                  <div className="h-8 bg-slate-100 rounded-xl" />
                </div>
              ))}
            </div>
          ) : settings.length === 0 ? (
            <RecurringEmptyState
              isFiltered={false}
              onAddSchedule={openAddModal}
              onApplyStarter={handleApplyStarter}
            />
          ) : filteredSettings.length === 0 ? (
            <RecurringEmptyState
              isFiltered={true}
              onResetFilters={resetFilters}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredSettings.map((item) => (
                <RecurringCardItem
                  key={item.id}
                  item={item}
                  categories={categories}
                  accounts={accounts}
                  onToggleActive={handleToggleActive}
                  onEdit={openEditModal}
                  onDelete={openDeleteModal}
                  getNextRunInfo={getNextRunInfo}
                  periodLabels={periodLabels}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ================= RECURRING MODAL ================= */}
      <RecurringModal
        isOpen={isModalOpen}
        onClose={closeModal}
        modalMode={modalMode}
        handleFormSubmit={handleFormSubmit}
        formState={formState}
        setFormState={setFormState}
        categories={categories}
        accounts={accounts}
        isSaving={isSaving}
      />

      {/* ================= CONFIRM DELETE MODAL ================= */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title={t("recurring.delete_title") || (isEn ? "Delete Recurring Schedule?" : "Hapus Transaksi Rutin?")}
        message={t("recurring.delete_desc") || (isEn
          ? "This automation schedule will be removed and transactions will no longer be created automatically. Past records remain intact."
          : "Jadwal otomatisasi ini akan dihapus dan transaksi tidak akan dicatat lagi secara berkala. Riwayat transaksi sebelumnya tetap aman.")}
        confirmText={t("recurring.btn_delete") || (isEn ? "Yes, Delete" : "Ya, Hapus")}
        cancelText={t("recurring.btn_cancel") || (isEn ? "Cancel" : "Batal")}
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
}
