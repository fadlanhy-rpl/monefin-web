"use client";

import { Suspense } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import GoalsHeader from "../../../components/goals/GoalsHeader";
import GoalsGrid from "../../../components/goals/GoalsGrid";
import GoalsStats from "../../../components/goals/GoalsStats";
import AchievedGoals from "../../../components/goals/AchievedGoals";
import GoalModal from "../../../components/goals/GoalModal";
import DepositModal from "../../../components/goals/DepositModal";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { CheckCircle2, Search, X } from "lucide-react";
import { useGoalsPage } from "../../../components/goals/hooks/useGoalsPage";

function GoalsPageContent() {
  const {
    t,
    language,
    isVisible,
    searchQuery,
    clearSearch,
    goals,
    achievedGoals,
    filteredGoals,
    accounts,
    selectedAccountId,
    setSelectedAccountId,
    toastMessage,
    isGoalModalOpen,
    modalMode,
    openAddModal,
    openEditModal,
    closeGoalModal,
    isConfirmOpen,
    isDeleting,
    handleDeleteClick,
    closeConfirmModal,
    handleConfirmDelete,
    formTitle,
    setFormTitle,
    formSubtitle,
    setFormSubtitle,
    formTarget,
    setFormTarget,
    formCurrent,
    setFormCurrent,
    formDeadlineDate,
    setFormDeadlineDate,
    formDeadlineText,
    setFormDeadlineText,
    formType,
    setFormType,
    formTag,
    setFormTag,
    formIcon,
    setFormIcon,
    handleFormSubmit,
    isDepositModalOpen,
    activeDepositGoal,
    depositAmount,
    setDepositAmount,
    depositActionType,
    setDepositActionType,
    openDepositModal,
    closeDepositModal,
    handleDepositSubmit,
    handleTogglePin,
  } = useGoalsPage();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Breadcrumb & Header Title */}
        <GoalsHeader 
          isVisible={isVisible}
          activeGoalsCount={goals.length}
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
              {language === 'en' ? 'Show All Goals' : 'Tampilkan Semua Target'}
            </button>
          </div>
        )}

        {/* Goals Active Cards Grid */}
        <div className={`transition-all duration-700 delay-300 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <GoalsGrid 
            goals={filteredGoals}
            openEditModal={openEditModal}
            handleDelete={handleDeleteClick}
            openDepositModal={openDepositModal}
            handleTogglePin={handleTogglePin}
            openAddModal={openAddModal}
            isFiltered={Boolean(searchQuery && searchQuery.trim() !== '')}
            searchQuery={searchQuery}
            onResetSearch={clearSearch}
          />
        </div>

        {/* Stats Row & Tips Cerdas */}
        {(goals.length > 0 || achievedGoals.length > 0) && (
          <div className={`transition-all duration-700 delay-500 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <GoalsStats 
              savingRate={850000}
              savingRateIncrease={12}
              openAddModal={openAddModal}
            />
          </div>
        )}

        {/* Achieved/Completed Goals */}
        <div className={`transition-all duration-700 delay-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <AchievedGoals 
            achievedGoals={achievedGoals}
          />
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-5 duration-300 z-50 border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Create / Edit Goal Modal */}
      <GoalModal 
        isOpen={isGoalModalOpen}
        onClose={closeGoalModal}
        modalMode={modalMode}
        handleFormSubmit={handleFormSubmit}
        formTitle={formTitle}
        setFormTitle={setFormTitle}
        formSubtitle={formSubtitle}
        setFormSubtitle={setFormSubtitle}
        formTarget={formTarget}
        setFormTarget={setFormTarget}
        formCurrent={formCurrent}
        setFormCurrent={setFormCurrent}
        formDeadlineDate={formDeadlineDate}
        setFormDeadlineDate={setFormDeadlineDate}
        formDeadlineText={formDeadlineText}
        setFormDeadlineText={setFormDeadlineText}
        formType={formType}
        setFormType={setFormType}
        formTag={formTag}
        setFormTag={setFormTag}
        formIcon={formIcon}
        setFormIcon={setFormIcon}
      />

      {/* Deposit & Withdraw Modal */}
      <DepositModal 
        isOpen={isDepositModalOpen}
        onClose={closeDepositModal}
        goal={activeDepositGoal}
        accounts={accounts}
        selectedAccountId={selectedAccountId}
        setSelectedAccountId={setSelectedAccountId}
        depositAmount={depositAmount}
        setDepositAmount={setDepositAmount}
        actionType={depositActionType}
        setActionType={setDepositActionType}
        handleDepositSubmit={handleDepositSubmit}
      />

      {/* Modern Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmDelete}
        title={t("goals.delete_title") || (language === 'en' ? "Delete this Goal?" : "Hapus Target Tabungan?")}
        message={t("goals.delete_desc") || (language === 'en' ? "Are you sure you want to delete this savings goal? Stored historical data will be removed." : "Apakah Anda yakin ingin menghapus target tabungan ini? Progress akumulasi dana akan dihentikan.")}
        confirmText={language === 'en' ? "Yes, Delete" : "Ya, Hapus"}
        cancelText={language === 'en' ? "Cancel" : "Batal"}
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
}

export default function GoalsPage() {
  return (
    <Suspense fallback={null}>
      <GoalsPageContent />
    </Suspense>
  );
}
