import { PlusCircle } from "lucide-react";

export default function CategoriesHeader({
  isVisible,
  openAddModal
}) {
  return (
    <div className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
      <div className="max-w-2xl">
        <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">Kategori Transaksi</h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-2 leading-relaxed font-medium">
          Kelola klasifikasi keuangan Anda dengan presisi. Atur anggaran dan pantau pengeluaran berdasarkan kategori yang dipersonalisasi.
        </p>
      </div>
      <button 
        onClick={openAddModal}
        className="flex items-center justify-center gap-2 bg-[#00685F] text-white px-5 py-3 rounded-2xl font-bold hover:bg-[#004D46] transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#00685F]/20 cursor-pointer text-sm w-full md:w-auto whitespace-nowrap"
      >
        <PlusCircle className="w-5 h-5 shrink-0" /> Add Category
      </button>
    </div>
  );
}
