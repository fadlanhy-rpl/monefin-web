import { X, Utensils, Car, ShoppingBag, Zap, Film, PiggyBank } from "lucide-react";

export default function BudgetModal({
  isOpen,
  onClose,
  modalMode,
  handleFormSubmit,
  formCategory,
  setFormCategory,
  formDescription,
  setFormDescription,
  formLimit,
  setFormLimit,
  formSpent,
  setFormSpent,
  formIcon,
  setFormIcon
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900">
            {modalMode === "add" ? "Set New Budget" : "Edit Budget"}
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
          {/* Category Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori (Category)</label>
            <input
              type="text"
              required
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-bold text-slate-800"
              placeholder="Contoh: Transportasi, Investasi"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deskripsi (Description)</label>
            <input
              type="text"
              required
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-semibold text-slate-800"
              placeholder="Keterangan singkat anggaran..."
            />
          </div>

          {/* Limit */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Batas Anggaran (Limit)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center font-black text-slate-400">Rp</span>
              <input
                type="number"
                required
                value={formLimit}
                onChange={(e) => setFormLimit(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-black text-slate-800"
                placeholder="0"
              />
            </div>
          </div>

          {/* Spent */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Telah Digunakan (Spent)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center font-black text-slate-400">Rp</span>
              <input
                type="number"
                value={formSpent}
                onChange={(e) => setFormSpent(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#00685F]/10 focus:border-[#00685F] transition-all text-sm font-black text-slate-800"
                placeholder="0"
              />
            </div>
          </div>

          {/* Icon Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pilih Ikon (Icon)</label>
            <div className="grid grid-cols-6 gap-2">
              {[
                { type: "utensils", icon: <Utensils className="w-5 h-5" /> },
                { type: "car", icon: <Car className="w-5 h-5" /> },
                { type: "shopping-bag", icon: <ShoppingBag className="w-5 h-5" /> },
                { type: "zap", icon: <Zap className="w-5 h-5" /> },
                { type: "film", icon: <Film className="w-5 h-5" /> },
                { type: "piggy-bank", icon: <PiggyBank className="w-5 h-5" /> }
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setFormIcon(item.type)}
                  className={`p-2.5 border rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                    formIcon === item.type 
                      ? "bg-brand-50 border-[#00685F] text-[#00685F] font-bold" 
                      : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100"
                  }`}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </div>

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
