import { X } from "lucide-react";

export default function GoalModal({
  isOpen,
  onClose,
  modalMode,
  handleFormSubmit,
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
  setFormTag
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900">
            {modalMode === "add" ? "Buat Target Baru" : "Edit Target Tabungan"}
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nama Target</label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-bold text-slate-800"
              placeholder="Contoh: Beli Laptop Baru, Dana Darurat"
            />
          </div>

          {/* Subtitle / Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deskripsi Singkat</label>
            <input
              type="text"
              value={formSubtitle}
              onChange={(e) => setFormSubtitle(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-semibold text-slate-800"
              placeholder="Contoh: Tabungan cadangan, reward karir"
            />
          </div>

          {/* Target Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Nominal</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center font-black text-slate-400">Rp</span>
              <input
                type="number"
                required
                value={formTarget}
                onChange={(e) => setFormTarget(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-black text-slate-800"
                placeholder="0"
              />
            </div>
          </div>

          {/* Current Saved Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tabungan Awal (Current)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center font-black text-slate-400">Rp</span>
              <input
                type="number"
                required
                value={formCurrent}
                onChange={(e) => setFormCurrent(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-black text-slate-800"
                placeholder="0"
              />
            </div>
          </div>

          {/* Type Selector (Linear or Donut) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Gaya Visual Tampilan</label>
            <select
              value={formType}
              onChange={(e) => setFormType(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-bold text-slate-800 cursor-pointer"
            >
              <option value="linear">Linear Card (Bar Progres Lebar)</option>
              <option value="circular">Circular Card (Donut Chart Kanan)</option>
            </select>
          </div>

          {/* Type specific fields */}
          {formType === "linear" ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tanggal Batas</label>
                <input
                  type="text"
                  value={formDeadlineDate}
                  onChange={(e) => setFormDeadlineDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-xs font-bold text-slate-800"
                  placeholder="31 Des 2026"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Durasi Sisa</label>
                <input
                  type="text"
                  value={formDeadlineText}
                  onChange={(e) => setFormDeadlineText(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-xs font-bold text-slate-800"
                  placeholder="5 bln lagi"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lencana Kategori (Tag)</label>
              <input
                type="text"
                value={formTag}
                onChange={(e) => setFormTag(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-semibold text-slate-800"
                placeholder="Contoh: Safety, Travel"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 bg-[#00685F] text-white rounded-2xl font-bold text-sm hover:bg-[#004D46] hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
