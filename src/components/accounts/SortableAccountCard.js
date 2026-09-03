import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  Landmark, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  MoreVertical, 
  Clock, 
  Pencil, 
  Trash2, 
  Copy, 
  Check, 
  GripHorizontal,
  Eye,
  EyeOff
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

/**
 * Modern floating options popover for cards
 */
function CardOptionsMenu({
  acc,
  isOpen,
  onToggle,
  onEdit,
  onDelete,
  isDarkTheme = false,
  language
}) {
  return (
    <div className="relative z-30">
      <button 
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(acc.id);
        }}
        className={`p-1.5 sm:p-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center ${
          isDarkTheme 
            ? 'text-white/60 hover:text-white hover:bg-white/15 active:bg-white/25' 
            : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:bg-slate-200'
        }`}
        aria-label="Options"
      >
        <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      
      {isOpen && (
        <>
          {/* Invisible backdrop to dismiss popover on outside click */}
          <div 
            className="fixed inset-0 z-40 cursor-default" 
            onClick={(e) => {
              e.stopPropagation();
              onToggle(acc.id);
            }} 
          />
          
          {/* Popover Card */}
          <div className="absolute right-0 mt-2 w-36 sm:w-40 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-900/20 border border-slate-100/90 p-1.5 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-black/5">
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(acc);
                onToggle(acc.id);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-emerald-50 text-slate-700 hover:text-[#00685F] flex items-center gap-2.5 transition-all duration-150 cursor-pointer group/btn"
            >
              <div className="w-6 h-6 rounded-lg bg-slate-100 group-hover/btn:bg-emerald-100/80 flex items-center justify-center text-slate-500 group-hover/btn:text-[#00685F] transition-colors shrink-0">
                <Pencil className="w-3 h-3" />
              </div>
              <span className="truncate">{language === 'en' ? "Edit" : "Ubah"}</span>
            </button>

            <div className="h-px bg-slate-100 my-1 mx-1" />

            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(acc.id);
                onToggle(acc.id);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-rose-50 text-slate-700 hover:text-rose-600 flex items-center gap-2.5 transition-all duration-150 cursor-pointer group/btn"
            >
              <div className="w-6 h-6 rounded-lg bg-slate-100 group-hover/btn:bg-rose-100/80 flex items-center justify-center text-slate-500 group-hover/btn:text-rose-600 transition-colors shrink-0">
                <Trash2 className="w-3 h-3" />
              </div>
              <span className="truncate">{language === 'en' ? "Delete" : "Hapus"}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

import { useCurrency } from "../../hooks/useCurrency";
import { useBalancePrivacy } from "../../context/BalancePrivacyContext";

export default function SortableAccountCard({
  acc,
  index,
  openEditModal,
  handleDelete,
  toggleMenu,
  activeMenuId,
  handleCopy,
  copiedId
}) {
  const { t, language } = useLanguage();
  const { formatCurrency } = useCurrency();
  const { isAccountHidden, toggleAccountPrivacy } = useBalancePrivacy();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: acc.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : "auto",
    position: "relative",
  };

  const isMenuOpen = activeMenuId === acc.id;
  const isHidden = isAccountHidden(acc.id);

  const renderCardContent = () => {
    // BCA Card (Primary Premium Green Gradient)
    if (acc.type === "bank" && acc.color_theme === "bank-primary") {
      return (
        <div 
          className={`bg-gradient-to-br from-[#00685F] via-[#008A7E] to-[#004D46] p-4 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] text-white flex flex-col justify-between h-56 sm:h-72 shadow-2xl shadow-[#00685F]/35 relative overflow-hidden transition-all duration-300 group ${isDragging ? 'scale-105 shadow-3xl ring-4 ring-[#00685F]/50' : 'hover:-translate-y-1.5 hover:shadow-3xl'}`}
          style={{ animationDelay: `${(index + 1) * 80}ms` }}
        >
          {/* Drag Handle Top Bar */}
          <div 
            {...attributes} 
            {...listeners} 
            role="button"
            tabIndex={0}
            aria-label={language === 'en' ? "Drag to reorder account card" : "Geser untuk mengatur urutan kartu rekening"}
            className="absolute top-0 left-0 w-full h-8 cursor-grab active:cursor-grabbing flex justify-center items-start pt-2 opacity-0 group-hover:opacity-100 transition-opacity z-20"
          >
            <GripHorizontal className="w-5 h-5 text-white/70" />
          </div>


          <div className="relative z-10 flex justify-between items-start mt-2">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 shrink-0">
                <Landmark className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-sm sm:text-lg tracking-wide uppercase leading-none truncate">{acc.name}</h4>
                <div className="flex items-center gap-1 mt-1 select-none">
                  <span className="text-[10px] sm:text-xs text-white/70 font-mono tracking-wider">{acc.account_number}</span>
                  <button 
                    type="button"
                    onClick={() => handleCopy(acc.id, acc.account_number)}
                    className="p-1 hover:bg-white/15 rounded text-white/50 hover:text-white transition cursor-pointer relative z-30"
                    title={language === 'en' ? "Copy Account Number" : "Salin Nomor Rekening"}
                  >
                    {copiedId === acc.id ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Options Menu */}
            <CardOptionsMenu 
              acc={acc}
              isOpen={isMenuOpen}
              onToggle={toggleMenu}
              onEdit={openEditModal}
              onDelete={handleDelete}
              isDarkTheme={true}
              language={language}
            />
          </div>

          {/* EMV Card Chip Visual for Realism */}
          <div className="relative z-10 w-7 h-5 sm:w-9 sm:h-7 bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 rounded-md border border-yellow-500/20 shadow-sm shrink-0 self-start select-none mt-1 sm:mt-0">
            <div className="absolute inset-x-1 top-0 bottom-0 border-l border-r border-amber-900/10"></div>
            <div className="absolute inset-y-1 left-0 right-0 border-t border-b border-amber-900/10"></div>
          </div>

          <div className="relative z-10 mt-1 sm:mt-2">
            <div className="flex items-center gap-1.5">
              <p className="text-[8px] sm:text-[10px] font-bold text-white/50 uppercase tracking-widest leading-none">{language === 'en' ? "Available Balance" : "Saldo Tersedia"}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAccountPrivacy(acc.id);
                }}
                className="p-1 hover:bg-white/15 rounded-md text-white/50 hover:text-white transition cursor-pointer relative z-30"
                title={isHidden ? (language === 'en' ? "Show Balance" : "Tampilkan Saldo") : (language === 'en' ? "Hide Balance" : "Sembunyikan Saldo")}
                aria-label="Toggle Balance Visibility"
              >
                {isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </button>
            </div>
            <h3 className="text-xl sm:text-4xl font-extrabold mt-1 sm:mt-1.5 tracking-tight font-mono sm:font-sans">
              {isHidden ? "••••••••" : formatCurrency(acc.balance)}
            </h3>
          </div>

          <div className="relative z-10 flex justify-between items-end border-t border-white/10 pt-2.5 sm:pt-4 mt-1 sm:mt-2">
            <div className="min-w-0">
              <p className="text-[8px] font-bold text-white/40 uppercase tracking-wide">{language === 'en' ? "Account Holder" : "Pemilik Rekening"}</p>
              <p className="font-extrabold text-[10px] sm:text-sm tracking-wide mt-0.5 truncate">{acc.account_holder || "N/A"}</p>
            </div>
            {/* Card Brand */}
            <span className="text-[8px] sm:text-[10px] font-black tracking-widest text-white/30 uppercase italic shrink-0">GPN</span>
          </div>

          {/* Glowing light highlight */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl opacity-40 group-hover:scale-110 transition-transform duration-500 pointer-events-none"></div>
        </div>
      );
    }

    // Mandiri Card (Luxurious Dark Black Card Theme)
    if (acc.type === "bank" && acc.color_theme === "bank-dark") {
      return (
        <div 
          className={`bg-gradient-to-br from-[#1E1E1E] via-[#2F2F2F] to-[#121212] p-4 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] text-white flex flex-col justify-between h-56 sm:h-72 shadow-xl relative overflow-hidden transition-all duration-300 border border-white/5 group ${isDragging ? 'scale-105 shadow-2xl ring-4 ring-white/20' : 'hover:-translate-y-1.5 hover:shadow-2xl'}`}
          style={{ animationDelay: `${(index + 1) * 80}ms` }}
        >
          {/* Drag Handle Top Bar */}
          <div 
            {...attributes} 
            {...listeners} 
            role="button"
            tabIndex={0}
            aria-label={language === 'en' ? "Drag to reorder account card" : "Geser untuk mengatur urutan kartu rekening"}
            className="absolute top-0 left-0 w-full h-8 cursor-grab active:cursor-grabbing flex justify-center items-start pt-2 opacity-0 group-hover:opacity-100 transition-opacity z-20"
          >
            <GripHorizontal className="w-5 h-5 text-white/50" />
          </div>


          <div className="relative z-10 flex justify-between items-start mt-2">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/80 border border-white/5 shrink-0">
                <CreditCard className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-sm sm:text-lg tracking-wide uppercase leading-none truncate">{acc.name}</h4>
                <div className="flex items-center gap-1 mt-1 select-none">
                  <span className="text-[10px] sm:text-xs text-white/40 font-mono tracking-wider">{acc.account_number}</span>
                  <button 
                    type="button"
                    onClick={() => handleCopy(acc.id, acc.account_number)}
                    className="p-1 hover:bg-white/15 rounded text-white/30 hover:text-white transition cursor-pointer relative z-30"
                    title={language === 'en' ? "Copy Account Number" : "Salin Nomor Rekening"}
                  >
                    {copiedId === acc.id ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Options Menu */}
            <CardOptionsMenu 
              acc={acc}
              isOpen={isMenuOpen}
              onToggle={toggleMenu}
              onEdit={openEditModal}
              onDelete={handleDelete}
              isDarkTheme={true}
              language={language}
            />
          </div>

          {/* EMV Card Chip Visual for Realism */}
          <div className="relative z-10 w-7 h-5 sm:w-9 sm:h-7 bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 rounded-md border border-yellow-500/20 shadow-sm shrink-0 self-start select-none mt-1 sm:mt-0">
            <div className="absolute inset-x-1 top-0 bottom-0 border-l border-r border-amber-900/10"></div>
            <div className="absolute inset-y-1 left-0 right-0 border-t border-b border-amber-900/10"></div>
          </div>

          <div className="mt-1 sm:mt-2">
            <div className="flex items-center gap-1.5">
              <p className="text-[8px] sm:text-[10px] font-bold text-white/30 uppercase tracking-widest leading-none">{language === 'en' ? "Total Savings" : "Total Tabungan"}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAccountPrivacy(acc.id);
                }}
                className="p-1 hover:bg-white/15 rounded-md text-white/30 hover:text-white transition cursor-pointer relative z-30"
                title={isHidden ? (language === 'en' ? "Show Balance" : "Tampilkan Saldo") : (language === 'en' ? "Hide Balance" : "Sembunyikan Saldo")}
                aria-label="Toggle Balance Visibility"
              >
                {isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </button>
            </div>
            <h3 className="text-xl sm:text-4xl font-extrabold mt-1 sm:mt-1.5 tracking-tight font-mono sm:font-sans">
              {isHidden ? "••••••••" : formatCurrency(acc.balance)}
            </h3>
          </div>

          <div className="flex justify-between items-center pt-2 mt-1 sm:mt-2">
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl select-none shrink-0">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-[8px] font-bold text-white/60 uppercase">Status: {language === 'en' ? "Active" : "Aktif"}</span>
            </div>
            {/* MasterCard Card logo */}
            <div className="flex gap-0.5 select-none opacity-40 group-hover:opacity-75 transition-opacity shrink-0">
              <div className="w-4 h-4 sm:w-5.5 sm:h-5.5 bg-red-500 rounded-full"></div>
              <div className="w-4 h-4 sm:w-5.5 sm:h-5.5 bg-amber-500 rounded-full -ml-2 sm:-ml-3"></div>
            </div>
          </div>

          {/* Silver card reflection highlight */}
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full blur-3xl opacity-45 group-hover:scale-105 transition-transform duration-500 pointer-events-none"></div>
        </div>
      );
    }

    // Wallet card (Premium Crisp White Layout)
    if (acc.type === "ewallet") {
      return (
        <div 
          className={`bg-white p-4 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-48 sm:h-64 transition-all duration-300 group relative overflow-hidden ${isDragging ? 'scale-105 shadow-2xl ring-4 ring-slate-200' : 'hover:shadow-lg'}`}
          style={{ animationDelay: `${(index + 1) * 80}ms` }}
        >
          {/* Drag Handle Top Bar */}
          <div 
            {...attributes} 
            {...listeners} 
            role="button"
            tabIndex={0}
            aria-label={language === 'en' ? "Drag to reorder account card" : "Geser untuk mengatur urutan kartu rekening"}
            className="absolute top-0 left-0 w-full h-8 cursor-grab active:cursor-grabbing flex justify-center items-start pt-2 opacity-0 group-hover:opacity-100 transition-opacity z-20"
          >
            <GripHorizontal className="w-5 h-5 text-slate-400" />
          </div>

          <div className="flex justify-between items-start relative z-10 mt-2">
            <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-[#00685F] shadow-inner shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1">
                <Smartphone className="w-5.5 h-5.5 sm:w-7 sm:h-7" />
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-sm sm:text-xl text-slate-900 tracking-tight leading-tight truncate">{acc.name}</h4>
                <span className="bg-[#00685F]/15 text-[#00685F] text-[10px] sm:text-xs font-black px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-wider mt-1 inline-block select-none shrink-0">
                  {acc.label || (language === 'en' ? "E-Wallet" : "Dompet Digital")}
                </span>
              </div>
            </div>
            
            {/* Options Menu */}
            <CardOptionsMenu 
              acc={acc}
              isOpen={isMenuOpen}
              onToggle={toggleMenu}
              onEdit={openEditModal}
              onDelete={handleDelete}
              isDarkTheme={false}
              language={language}
            />
          </div>
          
          <div className="flex justify-between items-end relative z-10 mt-1">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider leading-none">{language === 'en' ? "Available Balance" : "Saldo Tersedia"}</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAccountPrivacy(acc.id);
                  }}
                  className="p-1 hover:bg-slate-100 rounded-md text-slate-500 hover:text-[#00685F] transition cursor-pointer relative z-30"
                  title={isHidden ? (language === 'en' ? "Show Balance" : "Tampilkan Saldo") : (language === 'en' ? "Hide Balance" : "Sembunyikan Saldo")}
                  aria-label="Toggle Balance Visibility"
                >
                  {isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </div>
              <h3 className="text-xl sm:text-3xl font-black text-slate-900 mt-1 truncate font-mono sm:font-sans">
                {isHidden ? "••••••••" : formatCurrency(acc.balance)}
              </h3>
            </div>
            <div className="flex -space-x-2 select-none shrink-0">
              {(acc.wallets || ["GP", "OV"]).map((w, wIdx) => (
                <div 
                  key={wIdx} 
                  className={`w-7 h-7 sm:w-8 sm:h-8 border-2 border-white rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-black uppercase tracking-tighter shadow-sm transition-transform duration-300 group-hover:translate-x-0.5 ${
                    wIdx === 0 ? "bg-slate-200 text-slate-700" : "bg-[#00685F] text-white"
                  }`}
                >
                  {w}
                </div>
              ))}
            </div>
          </div>


          {/* Subtle soft backdrop highlight */}
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#00685F]/5 rounded-tl-[5rem] transition-transform duration-500 group-hover:scale-105 pointer-events-none"></div>
        </div>
      );
    }

    // Cash card (Premium Crisp White Layout with Clock/History)
    if (acc.type === "cash") {
      return (
        <div 
          className={`bg-white p-4 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-48 sm:h-64 transition-all duration-300 group relative overflow-hidden ${isDragging ? 'scale-105 shadow-2xl ring-4 ring-slate-200' : 'hover:shadow-lg'}`}
          style={{ animationDelay: `${(index + 1) * 80}ms` }}
        >
          {/* Drag Handle Top Bar */}
          <div 
            {...attributes} 
            {...listeners} 
            role="button"
            tabIndex={0}
            aria-label={language === 'en' ? "Drag to reorder account card" : "Geser untuk mengatur urutan kartu rekening"}
            className="absolute top-0 left-0 w-full h-8 cursor-grab active:cursor-grabbing flex justify-center items-start pt-2 opacity-0 group-hover:opacity-100 transition-opacity z-20"
          >
            <GripHorizontal className="w-5 h-5 text-slate-400" />
          </div>

          <div className="flex justify-between items-start relative z-10 mt-2">
            <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shadow-inner shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-1">
                <Banknote className="w-5.5 h-5.5 sm:w-7 sm:h-7 text-slate-500" />
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-sm sm:text-xl text-slate-900 tracking-tight leading-tight truncate">{acc.name}</h4>
                <span className="bg-slate-100 text-slate-700 text-[10px] sm:text-xs font-black px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-wider mt-1 inline-block select-none shrink-0">
                  {acc.label || (language === 'en' ? "Cash" : "Tunai")}
                </span>
              </div>
            </div>
            
            {/* Options Menu */}
            <CardOptionsMenu 
              acc={acc}
              isOpen={isMenuOpen}
              onToggle={toggleMenu}
              onEdit={openEditModal}
              onDelete={handleDelete}
              isDarkTheme={false}
              language={language}
            />
          </div>
          
          <div className="mt-1">
            <div className="flex items-center gap-1.5">
              <p className="text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider leading-none">{language === 'en' ? "Cash in Hand" : "Saldo Tunai"}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAccountPrivacy(acc.id);
                }}
                className="p-1 hover:bg-slate-100 rounded-md text-slate-500 hover:text-slate-700 transition cursor-pointer relative z-30"
                title={isHidden ? (language === 'en' ? "Show Balance" : "Tampilkan Saldo") : (language === 'en' ? "Hide Balance" : "Sembunyikan Saldo")}
                aria-label="Toggle Balance Visibility"
              >
                {isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </button>
            </div>
            <h3 className="text-xl sm:text-3xl font-black text-slate-900 mt-1 truncate font-mono sm:font-sans">
              {isHidden ? "••••••••" : formatCurrency(acc.balance)}
            </h3>
          </div>
          
          <div className="flex justify-between items-center text-[10px] sm:text-xs font-semibold text-slate-500 border-t border-slate-100 pt-2.5 sm:pt-4 mt-2 select-none relative z-10">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {language === 'en' ? "Last Updated" : "Terakhir Update"}</span>
            <span className="text-slate-600 truncate">{acc.lastUpdated || (language === 'en' ? "Today, 08:45" : "Hari ini, 08:45")}</span>
          </div>


          {/* Soft background pattern */}
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-slate-50 rounded-tl-[5rem] transition-transform duration-500 group-hover:scale-105 pointer-events-none"></div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div ref={setNodeRef} style={style}>
      {renderCardContent()}
    </div>
  );
}
