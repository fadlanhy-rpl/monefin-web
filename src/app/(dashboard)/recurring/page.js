"use client";

import { Plus, RefreshCcw } from "lucide-react";
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
    yearly: t("recurring.frequency_yearly") || (isEn ? "Yearly" : "Tahunan"),
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 min-w-0 pb-16 max-w-7xl mx-auto">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-500 ease-out">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#00685F]/10 text-[#00685F] text-[11px] font-bold tracking-wide">
                {isEn ? "Cash Flow Automation" : "Otomasi Arus Kas"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {t("recurring.title") || (isEn ? "Recurring Transactions" : "Transaksi Rutin")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              {t("recurring.subtitle") || (isEn ? "Automate scheduled income and expense tracking" : "Catat pemasukan dan pengeluaran secara otomatis sesuai jadwal.")}
            </p>
          </div>
          
          <button
            onClick={openAddModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-[#00685F] text-white font-bold rounded-2xl hover:bg-[#004D46] hover:shadow-lg hover:shadow-[#00685F]/20 transition-all active:scale-95 shrink-0 cursor-pointer min-h-[44px]"
          >
            <Plus className="w-5 h-5" />
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
            <div className="bg-white rounded-3xl border border-slate-200/80 p-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00685F]/10 flex items-center justify-center text-[#00685F]">
                <RefreshCcw className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  {isEn ? "Loading recurring schedules..." : "Memuat jadwal transaksi rutin..."}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isEn ? "Synchronizing automated entries" : "Sinkronisasi data otomasi finansial"}
                </p>
              </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        title={t("recurring.delete_title") || (isEn ? "Delete Recurring Transaction?" : "Hapus Transaksi Rutin?")}
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
