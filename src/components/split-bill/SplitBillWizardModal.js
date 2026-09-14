"use client";

import React from "react";
import { 
  X, 
  Receipt, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft 
} from "lucide-react";
import toast from "react-hot-toast";
import { useSplitBillWizard } from "./hooks/useSplitBillWizard";
import WizardProgressBar from "./wizard/WizardProgressBar";
import Step1BillDetails from "./wizard/Step1BillDetails";
import Step2Participants from "./wizard/Step2Participants";
import Step3SplitCalculation from "./wizard/Step3SplitCalculation";
import Step4PaymentConfirmation from "./wizard/Step4PaymentConfirmation";

export default function SplitBillWizardModal({ isOpen, onClose, onSuccess }) {
  const wizard = useSplitBillWizard({ isOpen, onClose, onSuccess });

  if (!isOpen) return null;

  const {
    step,
    setStep,
    isSubmitting,
    title,
    setTitle,
    billDate,
    setBillDate,
    subtotal,
    setSubtotal,
    taxPercent,
    setTaxPercent,
    servicePercent,
    setServicePercent,
    discountAmount,
    setDiscountAmount,
    splitMode,
    setSplitMode,
    roundingMode,
    setRoundingMode,
    participants,
    setParticipants,
    items,
    setItems,
    bankName,
    setBankName,
    accountNumber,
    setAccountNumber,
    accountHolder,
    setAccountHolder,
    recordMyExpense,
    setRecordMyExpense,
    selectedAccountId,
    setSelectedAccountId,
    selectedCategoryId,
    setSelectedCategoryId,
    calcPreview,
    computedTotal,
    exactAllocated,
    exactRemaining,
    totalPercentageSum,
    roundingOptions,
    accountOptions,
    categoryOptions,
    addParticipant,
    removeParticipant,
    handleSplitEqualPercentage,
    handleSplitEqualExact,
    handleAssignRestToMe,
    addItem,
    removeItem,
    toggleItemParticipant,
    handleSubmit,
    t,
    language,
    formatCurrency,
  } = wizard;

  const stepTitles = {
    1: t("split_bill.step1_title", "Info Acara & Total"),
    2: t("split_bill.step2_title", "Daftar Teman"),
    3: t("split_bill.step3_title", "Mode Pembagian"),
    4: t("split_bill.step4_title", "Pembayaran & Konfirmasi"),
  };

  const handleNextStep = () => {
    if (step === 1 && !title.trim()) {
      toast.error(language === "en" ? "Please enter bill or event name." : "Mohon isi nama acara tagihan.");
      return;
    }
    setStep(step + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden animate-badge-in">
        
        {/* MODAL HEADER */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/60 to-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#00685F] to-[#00A896] text-white flex items-center justify-center shadow-md shadow-emerald-800/20">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                {t("split_bill.modal_create_title", "Buat Pembagian Tagihan")}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {t("split_bill.modal_step_prefix", "Langkah {step} dari 4: {title}")
                  .replace("{step}", step)
                  .replace("{title}", stepTitles[step])}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP PROGRESS INDICATOR */}
        <WizardProgressBar step={step} setStep={setStep} t={t} />

        {/* MODAL BODY */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {step === 1 && (
            <Step1BillDetails
              title={title}
              setTitle={setTitle}
              billDate={billDate}
              setBillDate={setBillDate}
              subtotal={subtotal}
              setSubtotal={setSubtotal}
              taxPercent={taxPercent}
              setTaxPercent={setTaxPercent}
              servicePercent={servicePercent}
              setServicePercent={setServicePercent}
              discountAmount={discountAmount}
              setDiscountAmount={setDiscountAmount}
              roundingMode={roundingMode}
              setRoundingMode={setRoundingMode}
              roundingOptions={roundingOptions}
              computedTotal={computedTotal}
              participantsCount={participants.length}
              formatCurrency={formatCurrency}
              t={t}
            />
          )}

          {step === 2 && (
            <Step2Participants
              participants={participants}
              setParticipants={setParticipants}
              addParticipant={addParticipant}
              removeParticipant={removeParticipant}
              t={t}
            />
          )}

          {step === 3 && (
            <Step3SplitCalculation
              splitMode={splitMode}
              setSplitMode={setSplitMode}
              participants={participants}
              setParticipants={setParticipants}
              items={items}
              setItems={setItems}
              calcPreview={calcPreview}
              computedTotal={computedTotal}
              exactAllocated={exactAllocated}
              exactRemaining={exactRemaining}
              totalPercentageSum={totalPercentageSum}
              handleSplitEqualExact={handleSplitEqualExact}
              handleAssignRestToMe={handleAssignRestToMe}
              handleSplitEqualPercentage={handleSplitEqualPercentage}
              addItem={addItem}
              removeItem={removeItem}
              toggleItemParticipant={toggleItemParticipant}
              formatCurrency={formatCurrency}
              language={language}
              t={t}
            />
          )}

          {step === 4 && (
            <Step4PaymentConfirmation
              bankName={bankName}
              setBankName={setBankName}
              accountNumber={accountNumber}
              setAccountNumber={setAccountNumber}
              accountHolder={accountHolder}
              setAccountHolder={setAccountHolder}
              recordMyExpense={recordMyExpense}
              setRecordMyExpense={setRecordMyExpense}
              selectedAccountId={selectedAccountId}
              setSelectedAccountId={setSelectedAccountId}
              accountOptions={accountOptions}
              selectedCategoryId={selectedCategoryId}
              setSelectedCategoryId={setSelectedCategoryId}
              categoryOptions={categoryOptions}
              title={title}
              billDate={billDate}
              computedTotal={computedTotal}
              formatCurrency={formatCurrency}
              language={language}
              t={t}
            />
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-slate-100 transition-all cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t("split_bill.btn_previous", "Sebelumnya")}</span>
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-5 py-2.5 bg-[#00685F] hover:bg-[#00554E] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-800/20 cursor-pointer"
            >
              <span>{t("split_bill.btn_next", "Lanjut")}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-[#00A896] hover:from-emerald-700 hover:to-[#008f80] text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-700/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-300" />
              )}
              <span>{t("split_bill.btn_finish", "Selesaikan & Simpan")}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
