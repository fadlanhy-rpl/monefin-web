import { 
  Utensils, 
  Car, 
  ShoppingBag, 
  Film, 
  PlusSquare, 
  Home, 
  GraduationCap, 
  Plus, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  HelpCircle,
  Briefcase,
  DollarSign,
  TrendingUp
} from "lucide-react";
import { useState } from "react";

const iconMap = {
  utensils: Utensils,
  car: Car,
  shopping: ShoppingBag,
  film: Film,
  medical: PlusSquare,
  home: Home,
  graduation: GraduationCap,
  briefcase: Briefcase,
  dollar: DollarSign,
  trending: TrendingUp
};

const colorMap = {
  orange: { bg: "bg-orange-50 text-orange-600", bar: "bg-orange-500" },
  blue: { bg: "bg-blue-50 text-blue-600", bar: "bg-blue-500" },
  purple: { bg: "bg-purple-50 text-purple-600", bar: "bg-purple-500" },
  pink: { bg: "bg-pink-50 text-pink-600", bar: "bg-pink-500" },
  emerald: { bg: "bg-emerald-50 text-emerald-600", bar: "bg-emerald-500" },
  teal: { bg: "bg-teal-50 text-teal-600", bar: "bg-teal-500" },
  amber: { bg: "bg-amber-50 text-amber-600", bar: "bg-amber-500" },
  primary: { bg: "bg-[#E6F0EF] text-[#00685F]", bar: "bg-[#00685F]" }
};

export default function CategoriesGrid({
  categories,
  openEditModal,
  handleDelete,
  openAddModal
}) {
  const [activeMenuId, setActiveMenuId] = useState(null);

  const toggleMenu = (id) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName] || HelpCircle;
    return <IconComponent className="w-6 h-6" />;
  };

  const getColorClass = (colorName) => {
    return colorMap[colorName] || colorMap.primary;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
      {categories.map((cat, index) => {
        const colorClasses = getColorClass(cat.color);
        return (
          <div 
            key={cat.id} 
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-all duration-300 relative group"
            style={{ animationDelay: `${(index + 1) * 80}ms` }}
          >
            {/* Top row */}
            <div className="flex justify-between items-start">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${colorClasses.bg}`}>
                {getIcon(cat.icon)}
              </div>
              
              <div className="flex items-center gap-1.5 shrink-0 select-none">
                <span className="bg-slate-50 text-slate-400 text-[10px] font-black px-3 py-1 rounded-full uppercase border border-slate-100">
                  {cat.transactions} Transaksi
                </span>
                
                {/* Options Menu */}
                <div className="relative">
                  <button 
                    onClick={() => toggleMenu(cat.id)}
                    className="text-slate-300 hover:text-slate-500 transition p-1 hover:bg-slate-50 rounded-xl cursor-pointer"
                  >
                    <MoreVertical className="w-4.5 h-4.5" />
                  </button>
                  {activeMenuId === cat.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-2xl shadow-2xl border border-slate-100 py-1.5 z-20 text-slate-800 animate-in fade-in zoom-in-95 duration-155">
                      <button 
                        onClick={() => { openEditModal(cat); setActiveMenuId(null); }}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5 text-[#00685F]" /> Ubah
                      </button>
                      <button 
                        onClick={() => { handleDelete(cat.id); setActiveMenuId(null); }}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mid row */}
            <div className="min-w-0">
              <h3 className="font-extrabold text-slate-900 tracking-tight truncate text-base sm:text-lg">{cat.name}</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2 min-h-[2rem]">{cat.description}</p>
            </div>

            {/* Bottom row (Progress) */}
            <div className="space-y-2 select-none pt-1">
              <div className="flex justify-between text-[10px] font-black">
                <span className="text-gray-400 uppercase tracking-widest">Realisasi Anggaran</span>
                <span className="text-slate-900">{cat.realization}%</span>
              </div>
              <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden border border-slate-100/50">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    cat.realization >= 90 
                      ? "bg-red-500 shadow-sm shadow-red-500/20" 
                      : cat.realization >= 75 
                        ? "bg-orange-500 shadow-sm shadow-orange-500/20" 
                        : "bg-[#00685F] shadow-sm shadow-[#00685F]/20"
                  }`} 
                  style={{ width: `${Math.min(cat.realization, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}

      {/* CREATE CATEGORY DASHED CARD */}
      <div 
        onClick={openAddModal}
        className="bg-white p-6 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center space-y-4 hover:border-[#00685F] hover:shadow-sm transition-all duration-300 cursor-pointer group select-none min-h-[200px]"
      >
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-[#E6F0EF] group-hover:text-[#00685F] transition-all duration-300 scale-95 group-hover:scale-100 shadow-inner">
          <Plus className="w-6 h-6" />
        </div>
        <div className="text-center">
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Buat Kategori</h3>
          <p className="text-xs text-gray-400 mt-1">Tambahkan klasifikasi baru</p>
        </div>
      </div>
    </div>
  );
}
