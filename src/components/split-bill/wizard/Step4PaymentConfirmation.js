"use client";

import React from "react";
import { CreditCard, Wallet, Tag } from "lucide-react";
import CustomSelect from "../../ui/CustomSelect";

export default function Step4PaymentConfirmation({
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
  accountOptions,
  selectedCategoryId,
  setSelectedCategoryId,
  categoryOptions,
  title,
  billDate,
  computedTotal,
  formatCurrency,
  language,
  t,
}) {
  return (
    <div className="space-y-4">
      {/* Payment Details for Friends */}
      <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-3">
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-[#00685F]" />
          <span>{t("split_bill.payment_account_title", "Rekening / E-Wallet Tujuan Transfer")}</span>
        </h4>
        <p className="text-[11px] text-slate-500">
          {t("split_bill.payment_account_subtitle", "Info ini akan otomatis disertakan pada teks WhatsApp untuk ditransfer teman.")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder={t("split_bill.placeholder_bank", "Bank / E-Wallet (BCA/GoPay)")}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none shadow-2xs"
          />
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder={t("split_bill.placeholder_acc_no", "Nomor Rekening / HP")}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none shadow-2xs"
          />
          <input
            type="text"
            value={accountHolder}
            onChange={(e) => setAccountHolder(e.target.value)}
            placeholder={t("split_bill.placeholder_holder", "Atas Nama (a.n)")}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none shadow-2xs"
          />
        </div>
      </div>

      {/* Auto Record Expense Checkbox with Custom Selects */}
      <div className="bg-gradient-to-br from-emerald-50/90 to-teal-50/50 p-4 sm:p-5 rounded-2xl border border-emerald-200/90 space-y-3.5 shadow-2xs">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={recordMyExpense}
            onChange={(e) => setRecordMyExpense(e.target.checked)}
            className="w-4 h-4 rounded text-[#00685F] accent-[#00685F] cursor-pointer"
          />
          <span className="text-xs font-black text-slate-800">
            {t("split_bill.auto_record_checkbox", "Otomatis catat bagian saya ke Dompet MoneFin")}
          </span>
        </label>

        {recordMyExpense && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Custom Account Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-600 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-[#00685F]" />
                <span>{t("split_bill.choose_wallet", "Pilih Dompet / Rekening:")}</span>
              </label>
              <CustomSelect
                value={selectedAccountId}
                onChange={setSelectedAccountId}
                options={accountOptions}
                placeholder={t("split_bill.select_account_placeholder", "Pilih dompet / rekening...")}
              />
            </div>

            {/* Custom Category Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-600 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#00685F]" />
                <span>{t("split_bill.choose_category", "Kategori Pengeluaran:")}</span>
              </label>
              <CustomSelect
                value={selectedCategoryId}
                onChange={setSelectedCategoryId}
                options={categoryOptions}
                searchable
                placeholder={t("split_bill.select_category_placeholder", "Pilih kategori pengeluaran...")}
              />
            </div>
          </div>
        )}
      </div>

      {/* Final Summary Card */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl space-y-2 shadow-lg">
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>
            {t("split_bill.event_label", "Acara:")}{" "}
            <strong className="text-white">{title || (language === "en" ? "Untitled" : "Tanpa Judul")}</strong>
          </span>
          <span>{billDate}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-slate-800">
          <span className="text-xs font-bold">{t("split_bill.final_total_bill", "Total Pembagian:")}</span>
          <span className="text-lg font-black text-emerald-400">
            {formatCurrency(computedTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
