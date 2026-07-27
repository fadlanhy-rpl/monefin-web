import { X, Check } from "lucide-react";
import { 
  Utensils, 
  Car, 
  ShoppingBag, 
  Film, 
  PlusSquare, 
  Home, 
  GraduationCap, 
  Briefcase, 
  DollarSign, 
  TrendingUp 
} from "lucide-react";

const icons = [
  { name: "utensils", label: "Makanan", icon: Utensils },
  { name: "car", label: "Transportasi", icon: Car },
  { name: "shopping", label: "Belanja", icon: ShoppingBag },
  { name: "film", label: "Hiburan", icon: Film },
  { name: "medical", label: "Kesehatan", icon: PlusSquare },
  { name: "home", label: "Rumah", icon: Home },
  { name: "graduation", label: "Pendidikan", icon: GraduationCap },
  { name: "briefcase", label: "Pekerjaan", icon: Briefcase },
  { name: "dollar", label: "Finansial", icon: DollarSign },
  { name: "trending", label: "Investasi", icon: TrendingUp }
];

const colors = [
  { name: "orange", label: "Oranye", bg: "bg-orange-50 text-orange-600 border-orange-100" },
  { name: "blue", label: "Biru", bg: "bg-blue-50 text-blue-600 border-blue-100" },
  { name: "purple", label: "Ungu", bg: "bg-purple-50 text-purple-600 border-purple-100" },
  { name: "pink", label: "Merah Muda", bg: "bg-pink-50 text-pink-600 border-pink-100" },
  { name: "emerald", label: "Hijau Zamrud", bg: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { name: "teal", label: "Hijau Toska", bg: "bg-teal-50 text-teal-600 border-teal-100" },
  { name: "amber", label: "Kuning", bg: "bg-amber-50 text-amber-600 border-amber-100" },
  { name: "primary", label: "Default MoneFin", bg: "bg-[#E6F0EF] text-[#00685F] border-[#E6F0EF]" }
];

export default function CategoryModal({
  isOpen,
  onClose,
  onSubmit,
  modalMode, // "add" or "edit"
  formName,
  setFormName,
  formDescription,
  setFormDescription,
  formRealization,
  setFormRealization,
  formTransactions,
  setFormTransactions,
  formType,
  setFormType,
  formIcon,
  setFormIcon,
  formColor,
  setFormColor
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      ></div>

      {/* Modal Box */}
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl border border-slate-100 relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-center select-none shrink-0">
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {modalMode === "add" ? "Tambah Kategori Baru" : "Ubah Kategori"}
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition p-2 hover:bg-slate-50 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-8 py-4 overflow-y-auto no-scrollbar space-y-6 flex-1">
          {/* Category Name */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Nama Kategori</label>
            <input 
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Makanan & Minuman, Transportasi"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-semibold focus:border-[#00685F] focus:bg-white outline-none transition"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Deskripsi Singkat</label>
            <textarea 
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="e.g. Restoran, kafe, dan bahan makanan bulanan."
              rows={2}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-semibold focus:border-[#00685F] focus:bg-white outline-none transition resize-none"
            />
          </div>

          {/* Sibling columns for type & transactions */}
          <div className="grid grid-cols-2 gap-4">
            {/* Category Type */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Jenis Aliran</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-semibold focus:border-[#00685F] focus:bg-white outline-none transition cursor-pointer"
              >
                <option value="expense">Pengeluaran</option>
                <option value="income">Pemasukan</option>
              </select>
            </div>

            {/* Transactions count */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Jumlah Transaksi</label>
              <input 
                type="number"
                value={formTransactions}
                onChange={(e) => setFormTransactions(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-semibold focus:border-[#00685F] focus:bg-white outline-none transition"
                min="0"
              />
            </div>
          </div>

          {/* Budget Realization slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Realisasi Anggaran (%)</label>
              <span className="text-xs font-black text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">{formRealization}%</span>
            </div>
            <input 
              type="range"
              value={formRealization}
              onChange={(e) => setFormRealization(parseInt(e.target.value) || 0)}
              min="0"
              max="100"
              className="w-full accent-[#00685F] cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
            />
          </div>

          {/* Icon Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Pilih Ikon Kategori</label>
            <div className="grid grid-cols-5 gap-3">
              {icons.map((item) => {
                const IconComponent = item.icon;
                const isSelected = formIcon === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setFormIcon(item.name)}
                    title={item.label}
                    className={`w-full aspect-square rounded-2xl flex items-center justify-center border-2 transition-all cursor-pointer ${
                      isSelected 
                        ? "border-[#00685F] bg-[#E6F0EF] text-[#00685F] scale-105" 
                        : "border-slate-100 bg-slate-50 text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Pilih Warna Aksen</label>
            <div className="grid grid-cols-4 gap-3">
              {colors.map((item) => {
                const isSelected = formColor === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setFormColor(item.name)}
                    className={`h-11 rounded-2xl border-2 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer truncate px-2 ${
                      isSelected 
                        ? "border-slate-900 scale-105" 
                        : "border-slate-100"
                    } ${item.bg}`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 pb-8 pt-4 border-t border-slate-50 flex gap-4 shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-2xl font-bold transition text-sm cursor-pointer select-none"
          >
            Batal
          </button>
          <button 
            onClick={onSubmit}
            className="flex-1 bg-[#00685F] hover:bg-[#004D46] text-white py-3.5 rounded-2xl font-bold transition hover:shadow-lg active:scale-[0.98] text-sm cursor-pointer select-none"
          >
            {modalMode === "add" ? "Simpan Kategori" : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}
