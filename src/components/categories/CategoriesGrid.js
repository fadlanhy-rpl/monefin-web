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
  openAddModal,
  viewMode,
  showCreateCard,
  isTransitioning
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
    <div className="w-full">
      {viewMode === "card" ? (
        /* CARD VIEW */
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 transition-all duration-300 transform ${isTransitioning ? 'opacity-0 translate-y-3 scale-98' : 'opacity-100 translate-y-0 scale-100'}`}>
          {categories.map((cat, index) => {
            const colorClasses = getColorClass(cat.color);
            return (
              <div 
                key={cat.id} 
                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-all duration-300 relative group animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${(index + 1) * 60}ms` }}
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
          {showCreateCard && (
            <div 
              onClick={openAddModal}
              className="bg-white p-6 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center space-y-4 hover:border-[#00685F] hover:shadow-sm transition-all duration-300 cursor-pointer group select-none min-h-[200px] animate-in fade-in"
            >
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-[#E6F0EF] group-hover:text-[#00685F] transition-all duration-300 scale-95 group-hover:scale-100 shadow-inner">
                <Plus className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Buat Kategori</h3>
                <p className="text-xs text-gray-400 mt-1">Tambahkan klasifikasi baru</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* LIST VIEW */
        <div className={`flex flex-col gap-4 transition-all duration-300 transform ${isTransitioning ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}`}>
          {categories.map((cat, index) => {
            const colorClasses = getColorClass(cat.color);
            return (
              <div 
                key={cat.id}
                className="bg-white p-4.5 sm:p-5 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md hover:border-slate-200/60 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-1"
                style={{ animationDelay: `${(index + 1) * 60}ms` }}
              >
                {/* Left: Icon + Title & Desc */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${colorClasses.bg}`}>
                    {getIcon(cat.icon)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-slate-900 tracking-tight truncate text-sm sm:text-base">{cat.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xl font-medium">{cat.description}</p>
                  </div>
                </div>

                {/* Middle info (Transactions + Progress Bar) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-8 w-full sm:w-auto shrink-0">
                  {/* Transaction Badge */}
                  <div className="flex items-center justify-between sm:justify-start gap-2 sm:w-28">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest sm:hidden">Transaksi</span>
                    <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-xl border border-slate-100 select-none whitespace-nowrap">
                      {cat.transactions} Transaksi
                    </span>
                  </div>

                  {/* Budget progress bar */}
                  <div className="flex items-center gap-3 w-full sm:w-44 select-none">
                    <div className="flex-1 bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100/50">
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
                    <span className="text-xs font-black text-slate-800 min-w-[2.5rem] text-right">{cat.realization}%</span>
                  </div>
                </div>

                {/* Right: Actions menu */}
                <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 border-slate-50 pt-3 sm:pt-0 shrink-0">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest sm:hidden">Aksi Kategori</span>
                  <div className="relative">
                    <button 
                      onClick={() => toggleMenu(cat.id)}
                      className="text-slate-300 hover:text-slate-500 transition p-2 hover:bg-slate-50 rounded-xl cursor-pointer"
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
            );
          })}

          {/* CREATE CATEGORY DASHED LIST ROW */}
          {showCreateCard && (
            <div 
              onClick={openAddModal}
              className="bg-white p-4.5 sm:p-5 rounded-[1.5rem] border-2 border-dashed border-slate-200 flex items-center justify-center gap-3 text-slate-500 hover:border-[#00685F] hover:shadow-sm transition-all duration-300 cursor-pointer group select-none min-h-[70px] animate-in fade-in"
            >
              <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-[#E6F0EF] group-hover:text-[#00685F] transition-all duration-300 scale-95 group-hover:scale-100 shadow-inner">
                <Plus className="w-4.5 h-4.5" />
              </div>
              <span className="font-extrabold text-slate-900 text-sm group-hover:text-[#00685F] transition-colors">Buat Kategori Baru</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
