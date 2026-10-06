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
import { useCurrency } from "../../hooks/useCurrency";
import { useBalancePrivacy } from "../../context/BalancePrivacyContext";
import { BANK_THEMES, EWALLET_THEMES, CASH_THEMES } from "./accountThemes";

/**
 * Ergonomic floating drag handle with touch-action: none for mobile gesture support
 */
function CardDragHandle({ attributes, listeners, isDarkTheme, language }) {
  return (
    <div 
      {...attributes} 
      {...listeners} 
      role="button"
      tabIndex={0}
      aria-label={language === 'en' ? "Drag to reorder account card" : "Geser untuk mengatur urutan kartu rekening"}
      title={language === 'en' ? "Press and hold to reorder" : "Tekan dan tahan untuk menggeser urutan kartu"}
      style={{ touchAction: 'none' }}
      className={`absolute top-2.5 left-1/2 -translate-x-1/2 z-30 cursor-grab active:cursor-grabbing flex items-center justify-center px-3 py-1 rounded-full transition-all duration-200 select-none touch-none active:scale-95 min-h-[30px] sm:min-h-[26px] ${
        isDarkTheme 
          ? 'bg-black/35 hover:bg-black/55 active:bg-black/75 text-white/85 hover:text-white border border-white/20 backdrop-blur-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100 shadow-xs' 
          : 'bg-slate-100/95 hover:bg-slate-200 active:bg-slate-300 text-slate-500 hover:text-slate-700 border border-slate-200/90 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 shadow-xs'
      }`}
    >
      <GripHorizontal className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
    </div>
  );
}

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
  const { 
    isAccountHidden, 
    toggleAccountPrivacy,
    isAccountNumberHidden,
    toggleAccountNumberPrivacy,
    maskAccountNumber
  } = useBalancePrivacy();
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
  const isAccNumHidden = isAccountNumberHidden(acc.id);

  const renderCardContent = () => {
    // 1. Bank Cards (Curated Multi-Theme)
    if (acc.type === "bank") {
      const theme = BANK_THEMES[acc.color_theme] || BANK_THEMES["bank-primary"];
      const ThemeIcon = theme.icon || Landmark;
      const isMastercard = theme.brand === "MASTERCARD";
      const isVisa = theme.brand === "VISA";

      return (
        <div 
          className={`${theme.bg} p-4 sm:p-5 lg:p-6 xl:p-8 rounded-3xl xl:rounded-[2.5rem] text-white flex flex-col justify-between h-56 sm:h-64 lg:h-72 ${theme.shadow} relative overflow-hidden transition-all duration-300 border ${theme.border || "border-white/10"} group ${isDragging ? 'scale-105 shadow-3xl ring-4 ring-white/30' : 'hover:-translate-y-1.5 hover:shadow-3xl'}`}
          style={{ animationDelay: `${(index + 1) * 80}ms` }}
        >
          {/* Drag Handle */}
          <CardDragHandle 
            attributes={attributes} 
            listeners={listeners} 
            isDarkTheme={true} 
            language={language} 
          />

          <div className="relative z-10 flex justify-between items-start mt-1 sm:mt-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 shrink-0">
                <ThemeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white/90" />
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-xs sm:text-sm lg:text-base tracking-wide uppercase leading-tight truncate">{acc.name}</h4>
                <div className="flex items-center gap-1.5 mt-0.5 select-none">
                  <span className="text-[10px] sm:text-xs text-white/70 font-mono tracking-wider truncate">
                    {isAccNumHidden ? maskAccountNumber(acc.account_number) : (acc.account_number || "•••• •••• ••••")}
                  </span>
                  {acc.account_number && (
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAccountNumberPrivacy(acc.id);
                        }}
                        className="p-1 hover:bg-white/15 rounded text-white/60 hover:text-white transition cursor-pointer relative z-30"
                        title={isAccNumHidden ? (language === 'en' ? "Show Account Number" : "Tampilkan Nomor Rekening") : (language === 'en' ? "Hide Account Number" : "Tutupi Nomor Rekening")}
                        aria-label="Toggle Account Number Privacy"
                      >
                        {isAccNumHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(acc.id, acc.account_number);
                        }}
                        className="p-1 hover:bg-white/15 rounded text-white/60 hover:text-white transition cursor-pointer relative z-30"
                        title={language === 'en' ? "Copy Account Number" : "Salin Nomor Rekening"}
                        aria-label="Copy Account Number"
                      >
                        {copiedId === acc.id ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  )}
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
          <div className="relative z-10 w-7 h-5 sm:w-8 sm:h-6 lg:w-9 lg:h-7 bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 rounded-md border border-yellow-500/20 shadow-sm shrink-0 self-start select-none mt-1">
            <div className="absolute inset-x-1 top-0 bottom-0 border-l border-r border-amber-900/10"></div>
            <div className="absolute inset-y-1 left-0 right-0 border-t border-b border-amber-900/10"></div>
          </div>

          <div className="relative z-10 mt-1 sm:mt-2 min-w-0">
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
            <h3 className="text-lg sm:text-2xl md:text-xl lg:text-2xl xl:text-3xl font-extrabold mt-1 tracking-tight font-mono sm:font-sans truncate">
              {isHidden ? "••••••••" : formatCurrency(acc.balance)}
            </h3>
          </div>

          <div className="relative z-10 flex justify-between items-end border-t border-white/10 pt-2 sm:pt-3 mt-1">
            <div className="min-w-0">
              <p className="text-[8px] font-bold text-white/40 uppercase tracking-wide">{language === 'en' ? "Account Holder" : "Pemilik Rekening"}</p>
              <p className="font-extrabold text-[10px] sm:text-xs lg:text-sm tracking-wide mt-0.5 truncate">{acc.account_holder || "—"}</p>
            </div>
            {/* Card Brand */}
            {isMastercard ? (
              <div className="flex gap-0.5 select-none opacity-60 group-hover:opacity-90 transition-opacity shrink-0 ml-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full"></div>
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-amber-500 rounded-full -ml-2 sm:-ml-2.5"></div>
              </div>
            ) : isVisa ? (
              <span className="text-[10px] sm:text-xs font-black tracking-widest text-white/50 italic shrink-0 ml-2">VISA</span>
            ) : (
              <span className="text-[8px] sm:text-[10px] font-black tracking-widest text-white/40 uppercase italic shrink-0 ml-2">{theme.brand || "GPN"}</span>
            )}
          </div>

          {/* Glowing light highlight */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl opacity-40 group-hover:scale-110 transition-transform duration-500 pointer-events-none"></div>
        </div>
      );
    }

    // 2. E-Wallet Cards (Curated Multi-Theme)
    if (acc.type === "ewallet") {
      const theme = EWALLET_THEMES[acc.color_theme] || EWALLET_THEMES["wallet"];
      const isDark = theme.isDark;

      return (
        <div 
          className={`${theme.cardBg} p-4 sm:p-5 lg:p-6 xl:p-8 rounded-3xl xl:rounded-[2.5rem] border shadow-sm flex flex-col justify-between h-52 sm:h-60 lg:h-64 transition-all duration-300 group relative overflow-hidden ${isDragging ? 'scale-105 shadow-2xl ring-4 ring-slate-200' : 'hover:shadow-lg'}`}
          style={{ animationDelay: `${(index + 1) * 80}ms` }}
        >
          <CardDragHandle 
            attributes={attributes} 
            listeners={listeners} 
            isDarkTheme={isDark} 
            language={language} 
          />

          <div className="flex justify-between items-start relative z-10 mt-1 sm:mt-2">
            <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${theme.iconBox} rounded-2xl flex items-center justify-center shadow-inner shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1`}>
                <Smartphone className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 lg:w-6 lg:h-6" />
              </div>
              <div className="min-w-0">
                <h4 className={`font-extrabold text-xs sm:text-sm lg:text-base ${isDark ? 'text-white' : 'text-slate-900'} tracking-tight leading-tight truncate`}>{acc.name}</h4>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`${theme.badge} text-[9px] sm:text-[10px] font-black px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full uppercase tracking-wider mt-0.5 inline-block select-none shrink-0`}>
                    {acc.label || (language === 'en' ? "E-Wallet" : "Dompet Digital")}
                  </span>
                  {acc.account_number && (
                    <div className="flex items-center gap-1 mt-0.5 select-none">
                      <span className={`text-[10px] sm:text-xs ${isDark ? 'text-white/70' : 'text-slate-500'} font-mono tracking-wider truncate`}>
                        {isAccNumHidden ? maskAccountNumber(acc.account_number) : acc.account_number}
                      </span>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAccountNumberPrivacy(acc.id);
                          }}
                          className={`p-1 hover:bg-slate-100/20 rounded ${isDark ? 'text-white/60 hover:text-white' : 'text-slate-400 hover:text-slate-700'} transition cursor-pointer relative z-30`}
                          title={isAccNumHidden ? (language === 'en' ? "Show Account Number" : "Tampilkan Nomor Rekening") : (language === 'en' ? "Hide Account Number" : "Tutupi Nomor Rekening")}
                          aria-label="Toggle Account Number Privacy"
                        >
                          {isAccNumHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(acc.id, acc.account_number);
                          }}
                          className={`p-1 hover:bg-slate-100/20 rounded ${isDark ? 'text-white/60 hover:text-white' : 'text-slate-400 hover:text-slate-700'} transition cursor-pointer relative z-30`}
                          title={language === 'en' ? "Copy Account Number" : "Salin Nomor Rekening"}
                          aria-label="Copy Account Number"
                        >
                          {copiedId === acc.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  )}
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
              isDarkTheme={isDark}
              language={language}
            />
          </div>
          
          <div className="relative z-10 mt-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className={`text-[9px] sm:text-[10px] font-bold ${isDark ? 'text-white/60' : 'text-slate-500'} uppercase tracking-wider leading-none`}>{language === 'en' ? "Available Balance" : "Saldo Tersedia"}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAccountPrivacy(acc.id);
                }}
                className={`p-1 hover:bg-slate-100/20 rounded-md ${isDark ? 'text-white/60 hover:text-white' : 'text-slate-500 hover:text-slate-900'} transition cursor-pointer relative z-30`}
                title={isHidden ? (language === 'en' ? "Show Balance" : "Tampilkan Saldo") : (language === 'en' ? "Hide Balance" : "Sembunyikan Saldo")}
                aria-label="Toggle Balance Visibility"
              >
                {isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </button>
            </div>
            <h3 className={`text-lg sm:text-2xl md:text-xl lg:text-2xl xl:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'} mt-1 tracking-tight font-mono sm:font-sans truncate`}>
              {isHidden ? "••••••••" : formatCurrency(acc.balance)}
            </h3>
          </div>

          <div className={`flex justify-between items-center border-t ${isDark ? 'border-white/10' : 'border-slate-100'} pt-2 sm:pt-3 mt-1 relative z-10`}>
            <span className={`text-[9px] sm:text-[10px] font-semibold ${isDark ? 'text-white/50' : 'text-slate-400'} truncate`}>
              {language === 'en' ? "Connected Wallets" : "Dompet Terhubung"}
            </span>
            <div className="flex -space-x-1.5 sm:-space-x-2 select-none shrink-0">
              {(acc.wallets || ["GP", "OV"]).map((w, wIdx) => (
                <div 
                  key={wIdx} 
                  className={`w-6 h-6 sm:w-7 sm:h-7 border-2 ${isDark ? 'border-zinc-800' : 'border-white'} rounded-full flex items-center justify-center text-[8px] sm:text-[9px] font-black uppercase tracking-tighter shadow-xs transition-transform duration-300 group-hover:translate-x-0.5 ${
                    wIdx === 0 ? (isDark ? "bg-zinc-700 text-white" : "bg-slate-200 text-slate-700") : `${theme.primaryDot} text-white`
                  }`}
                >
                  {w}
                </div>
              ))}
            </div>
          </div>

          {/* Subtle soft backdrop highlight */}
          <div className={`absolute right-0 bottom-0 w-32 h-32 ${theme.glow} rounded-tl-[5rem] transition-transform duration-500 group-hover:scale-105 pointer-events-none`}></div>
        </div>
      );
    }

    // 3. Cash Cards (Curated Multi-Theme)
    if (acc.type === "cash") {
      const theme = CASH_THEMES[acc.color_theme] || CASH_THEMES["cash"];

      return (
        <div 
          className={`${theme.cardBg} p-4 sm:p-5 lg:p-6 xl:p-8 rounded-3xl xl:rounded-[2.5rem] border shadow-sm flex flex-col justify-between h-52 sm:h-60 lg:h-64 transition-all duration-300 group relative overflow-hidden ${isDragging ? 'scale-105 shadow-2xl ring-4 ring-slate-200' : 'hover:shadow-lg'}`}
          style={{ animationDelay: `${(index + 1) * 80}ms` }}
        >
          <CardDragHandle 
            attributes={attributes} 
            listeners={listeners} 
            isDarkTheme={false} 
            language={language} 
          />

          <div className="flex justify-between items-start relative z-10 mt-1 sm:mt-2">
            <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${theme.iconBox} rounded-2xl flex items-center justify-center shadow-inner shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-1`}>
                <Banknote className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 lg:w-6 lg:h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-xs sm:text-sm lg:text-base text-slate-900 tracking-tight leading-tight truncate">{acc.name}</h4>
                <span className={`${theme.badge} text-[9px] sm:text-[10px] font-black px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full uppercase tracking-wider mt-0.5 inline-block select-none shrink-0`}>
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
          
          <div className="relative z-10 mt-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none">{language === 'en' ? "Cash in Hand" : "Saldo Tunai"}</p>
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
            <h3 className="text-lg sm:text-2xl md:text-xl lg:text-2xl xl:text-3xl font-black text-slate-900 mt-1 tracking-tight font-mono sm:font-sans truncate">
              {isHidden ? "••••••••" : formatCurrency(acc.balance)}
            </h3>
          </div>
          
          <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-semibold text-slate-500 border-t border-slate-100 pt-2 sm:pt-3 mt-1 select-none relative z-10">
            <span className="flex items-center gap-1 truncate"><Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" /> {language === 'en' ? "Updated" : "Update"}</span>
            <span className="text-slate-600 truncate ml-1">{acc.lastUpdated || (language === 'en' ? "Today, 08:45" : "Hari ini, 08:45")}</span>
          </div>

          {/* Soft background pattern */}
          <div className={`absolute right-0 bottom-0 w-32 h-32 ${theme.glow} rounded-tl-[5rem] transition-transform duration-500 group-hover:scale-105 pointer-events-none`}></div>
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
