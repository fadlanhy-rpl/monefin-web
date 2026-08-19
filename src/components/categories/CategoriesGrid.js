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
  TrendingUp,
  Banknote,
  Wallet,
  Gift,
  Coins,
  FileText,
  Gamepad2,
  HeartPulse,
  MoreHorizontal
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

const iconMap = {
  "utensils": Utensils,
  "car": Car,
  "shopping-bag": ShoppingBag,
  "shopping": ShoppingBag,
  "film": Film,
  "medical": PlusSquare,
  "home": Home,
  "graduation-cap": GraduationCap,
  "graduation": GraduationCap,
  "briefcase": Briefcase,
  "dollar": DollarSign,
  "trending-up": TrendingUp,
  "trending": TrendingUp,
  "banknote": Banknote,
  "wallet": Wallet,
  "gift": Gift,
  "coins": Coins,
  "file-text": FileText,
  "gamepad-2": Gamepad2,
  "heart-pulse": HeartPulse,
  "more-horizontal": MoreHorizontal
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

function CategoryOptionsMenu({ isOpen, onClose, onEdit, onDelete, t, language }) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose} 
      />
      <div 
        className="absolute right-0 top-full mt-2 w-44 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-left select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => {
            onClose();
            onEdit();
          }}
          className="w-full px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-[#00685F] hover:bg-[#00685F]/5 flex items-center gap-2.5 transition-colors cursor-pointer"
        >
          <div className="w-6 h-6 rounded-lg bg-emerald-50 text-[#00685F] flex items-center justify-center shrink-0">
            <Pencil className="w-3.5 h-3.5" />
          </div>
          <span>{t("common.edit") || (language === 'en' ? "Edit" : "Ubah")}</span>
        </button>

        <div className="h-px bg-slate-100 my-1" />

        <button
          type="button"
          onClick={() => {
            onClose();
            onDelete();
          }}
          className="w-full px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
        >
          <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Trash2 className="w-3.5 h-3.5" />
          </div>
          <span>{t("common.delete") || (language === 'en' ? "Delete" : "Hapus")}</span>
        </button>
      </div>
    </>
  );
}

export default function CategoriesGrid({
  categories,
  openEditModal,
  handleDelete,
  openAddModal,
  viewMode,
  showCreateCard,
  isTransitioning
}) {
  const { t, language } = useLanguage();
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
                      {cat.transactions_count || 0} {t("categories.transaction_count") || "TRANSAKSI"}
                    </span>
                    {/* Options Menu */}
                    <div className="relative">
                      <button 
                        onClick={() => toggleMenu(cat.id)}
                        className="text-slate-300 hover:text-slate-500 transition p-1 hover:bg-slate-50 rounded-xl cursor-pointer"
                      >
                        <MoreVertical className="w-4.5 h-4.5" />
                      </button>
                      <CategoryOptionsMenu 
                        isOpen={activeMenuId === cat.id}
                        onClose={() => setActiveMenuId(null)}
                        onEdit={() => openEditModal(cat)}
                        onDelete={() => handleDelete(cat.id)}
                        t={t}
                        language={language}
                      />
                    </div>
                  </div>
                </div>

                {/* Mid row */}
                <div className="min-w-0">
                  <h3 className="font-extrabold text-slate-900 tracking-tight truncate text-base sm:text-lg">{cat.name}</h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2 min-h-[2rem]">{cat.description}</p>
                </div>

                {/* Bottom row */}
                <div className="space-y-2 select-none pt-1">
                  <div className="flex justify-between items-end mb-2.5">
                    <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                      {t("categories.budget_realization") || "REALISASI ANGGARAN"}
                    </span>
                    <span className="text-sm font-extrabold text-slate-700">{cat.realization || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden border border-slate-100/50">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        (cat.realization || 0) >= 90 
                          ? "bg-red-500 shadow-sm shadow-red-500/20" 
                          : (cat.realization || 0) >= 75 
                            ? "bg-orange-500 shadow-sm shadow-orange-500/20" 
                            : "bg-[#00685F] shadow-sm shadow-[#00685F]/20"
                      }`} 
                      style={{ width: `${Math.min(cat.realization || 0, 100)}%` }}
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
              className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#00685F]/5 hover:border-[#00685F]/30 transition-all duration-300 min-h-[220px] group animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${(categories.length + 1) * 60}ms` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 text-slate-400 group-hover:text-[#00685F]">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-700 group-hover:text-[#00685F] transition-colors">
                {t("categories.create_new") || "Buat Kategori Baru"}
              </h3>
              <p className="text-xs font-medium text-slate-400 mt-2 max-w-[180px]">
                {t("categories.add_new_desc") || "Mulai lacak keuangan lebih detail."}
              </p>
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
                className="bg-white p-3.5 sm:p-5 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center justify-between gap-3 hover:shadow-md hover:border-slate-200/60 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-1"
                style={{ animationDelay: `${(index + 1) * 60}ms` }}
              >
                {/* Left: Icon + Title & Sub */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${colorClasses.bg}`}>
                    {getIcon(cat.icon)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-slate-900 tracking-tight truncate text-xs sm:text-base leading-tight">
                      {cat.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 select-none">
                      <span className="bg-slate-50 text-slate-500 text-[9px] font-bold px-2 py-0.5 rounded-lg border border-slate-100 sm:hidden">
                        {cat.transactions_count || 0} {t("categories.transaction_count") || "TRANSAKSI"}
                      </span>
                      <p className="text-xs text-gray-400 truncate hidden sm:block max-w-md font-medium">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: progress + transactions + action */}
                <div className="flex items-center gap-3 sm:gap-8 shrink-0">
                  {/* Transaction badge */}
                  <div className="hidden sm:flex items-center gap-1.5">
                    <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-xl border border-slate-100 select-none">
                      {cat.transactions_count || 0} {t("categories.transaction_count") || "TRANSAKSI"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 select-none">
                    <div className="hidden sm:block w-28 bg-slate-50 h-1.5 rounded-full overflow-hidden border border-slate-100/50">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          (cat.realization || 0) >= 90 
                            ? "bg-red-500" 
                            : (cat.realization || 0) >= 75 
                              ? "bg-orange-500" 
                              : "bg-[#00685F]"
                        }`} 
                        style={{ width: `${Math.min(cat.realization || 0, 100)}%` }}
                      ></div>
                    </div>
                    <span className={`text-[10px] sm:text-xs font-black px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg shrink-0 ${
                      (cat.realization || 0) >= 90 
                        ? "bg-red-50 text-red-600 border border-red-100" 
                        : (cat.realization || 0) >= 75 
                          ? "bg-orange-50 text-orange-600 border border-orange-100" 
                          : "bg-[#E6F0EF] text-[#00685F] border border-[#00685F]/10"
                    }`}>
                      {cat.realization || 0}%
                    </span>
                  </div>

                  <div className="relative">
                    <button 
                      onClick={() => toggleMenu(cat.id)}
                      className="text-slate-300 hover:text-slate-500 transition p-1.5 hover:bg-slate-50 rounded-xl cursor-pointer"
                    >
                      <MoreVertical className="w-4.5 h-4.5" />
                    </button>
                    <CategoryOptionsMenu 
                      isOpen={activeMenuId === cat.id}
                      onClose={() => setActiveMenuId(null)}
                      onEdit={() => openEditModal(cat)}
                      onDelete={() => handleDelete(cat.id)}
                      t={t}
                      language={language}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* CREATE CATEGORY DASHED LIST ROW */}
          {showCreateCard && (
            <div 
              onClick={openAddModal}
              className="bg-white p-3.5 sm:p-5 rounded-[1.5rem] border-2 border-dashed border-slate-200 flex items-center justify-center gap-3 text-slate-500 hover:border-[#00685F] hover:shadow-sm transition-all duration-300 cursor-pointer group select-none min-h-[50px] sm:min-h-[70px] animate-in fade-in"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-[#E6F0EF] group-hover:text-[#00685F] transition-all duration-300 scale-95 group-hover:scale-100 shadow-inner">
                <Plus className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm group-hover:text-[#00685F] transition-colors">{t("categories.create_new") || "Buat Kategori Baru"}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
