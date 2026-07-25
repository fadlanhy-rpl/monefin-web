"use client";

import { X, ChevronDown, Check } from "lucide-react";

export default function TransactionModal({
  isOpen,
  onClose,
  modalMode,
  handleFormSubmit,
  formType,
  setFormType,
  formAmount,
  setFormAmount,
  formCategory,
  setFormCategory,
  formAccount,
  setFormAccount,
  formDate,
  setFormDate,
  formNote,
  setFormNote,
  isFormCategoryOpen,
  setIsFormCategoryOpen,
  isFormAccountOpen,
  setIsFormAccountOpen
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900">
            {modalMode === "add" ? "Add Transaction" : "Edit Transaction"}
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
          {/* Type Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setFormType("income")}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${formType === "income" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              Pemasukan (Income)
            </button>
            <button
              type="button"
              onClick={() => setFormType("expense")}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${formType === "expense" ? "bg-white text-red-500 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              Pengeluaran (Expense)
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Jumlah (Amount)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center font-black text-slate-400">Rp</span>
              <input
                type="number"
                required
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-black text-slate-800"
                placeholder="0"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5 relative">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori (Category)</label>
            <button
              type="button"
              onClick={() => {
                setIsFormCategoryOpen(!isFormCategoryOpen);
                setIsFormAccountOpen(false);
              }}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-left flex items-center justify-between text-sm text-slate-600 font-bold cursor-pointer relative z-30"
            >
              <span>{formCategory}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isFormCategoryOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isFormCategoryOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setIsFormCategoryOpen(false)} />
                <div className="dropdown-pop absolute left-0 right-0 mt-1.5 bg-white border border-slate-100 rounded-2xl shadow-xl z-30 py-1.5 max-h-52 overflow-y-auto">
                  {['Salary', 'Food & Drink', 'Transport', 'Shopping', 'Investment'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setFormCategory(cat);
                        setIsFormCategoryOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors flex items-center justify-between ${
                        formCategory === cat 
                          ? 'bg-brand-50 text-brand-700' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span>{cat}</span>
                      {formCategory === cat && <Check className="w-3.5 h-3.5 text-brand-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Account */}
          <div className="space-y-1.5 relative">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rekening (Account)</label>
            <button
              type="button"
              onClick={() => {
                setIsFormAccountOpen(!isFormAccountOpen);
                setIsFormCategoryOpen(false);
              }}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-left flex items-center justify-between text-sm text-slate-600 font-bold cursor-pointer relative z-30"
            >
              <span>{formAccount}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isFormAccountOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isFormAccountOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setIsFormAccountOpen(false)} />
                <div className="dropdown-pop absolute left-0 right-0 mt-1.5 bg-white border border-slate-100 rounded-2xl shadow-xl z-30 py-1.5 max-h-52 overflow-y-auto">
                  {['Bank Central Asia', 'GoPay Wallet', 'Mandiri Bank', 'Credit Card', 'Stock Portfolio'].map((acc) => (
                    <button
                      key={acc}
                      type="button"
                      onClick={() => {
                        setFormAccount(acc);
                        setIsFormAccountOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors flex items-center justify-between ${
                        formAccount === acc 
                          ? 'bg-brand-50 text-brand-700' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span>{acc}</span>
                      {formAccount === acc && <Check className="w-3.5 h-3.5 text-brand-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tanggal (Date)</label>
            <input
              type="date"
              required
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm text-slate-600 font-bold cursor-pointer"
            />
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Catatan (Note)</label>
            <input
              type="text"
              value={formNote}
              onChange={(e) => setFormNote(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm text-slate-600 font-semibold"
              placeholder="Keterangan transaksi..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 bg-[#00685F] text-white rounded-2xl font-bold text-sm hover:bg-[#004D46] hover:shadow-lg transition-all active:scale-95"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
