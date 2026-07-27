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
  CheckCircle2 
} from "lucide-react";
import { useState } from "react";

export default function AccountsGrid({
  accounts,
  openEditModal,
  handleDelete
}) {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const toggleMenu = (id) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text.replace("xxxx", "1234")); // Mock full copy
    setCopiedId(id);
    setToastMessage("Nomor rekening berhasil disalin!");
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  return (
    <div className="relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-5 duration-300 z-50 border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Grid container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {accounts.map((acc, index) => {
          // BCA Card (Primary Premium Green Gradient)
          if (acc.type === "bank-primary") {
            return (
              <div 
                key={acc.id} 
                className="bg-gradient-to-br from-[#00685F] via-[#008A7E] to-[#004D46] p-5 xs:p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] text-white flex flex-col justify-between h-64 sm:h-72 shadow-2xl shadow-[#00685F]/35 relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-3xl group"
                style={{ animationDelay: `${(index + 1) * 80}ms` }}
              >
                <div className="relative z-10 flex justify-between items-start">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 shrink-0">
                      <Landmark className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-base sm:text-lg tracking-wide uppercase leading-none truncate">{acc.name}</h4>
                      <div className="flex items-center gap-1.5 mt-1 select-none">
                        <span className="text-[10px] sm:text-xs text-white/70 font-mono tracking-wider">{acc.number}</span>
                        <button 
                          onClick={() => handleCopy(acc.id, acc.number)}
                          className="p-1 hover:bg-white/15 rounded text-white/50 hover:text-white transition cursor-pointer"
                          title="Salin Nomor Rekening"
                        >
                          {copiedId === acc.id ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Options Menu */}
                  <div className="relative">
                    <button 
                      onClick={() => toggleMenu(acc.id)}
                      className="text-white/40 hover:text-white transition p-1.5 hover:bg-white/10 rounded-xl cursor-pointer"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    
                    {activeMenuId === acc.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white rounded-2xl shadow-2xl border border-slate-100 py-1.5 z-20 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                        <button 
                          onClick={() => { openEditModal(acc); setActiveMenuId(null); }}
                          className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5 text-[#00685F]" /> Ubah
                        </button>
                        <button 
                          onClick={() => { handleDelete(acc.id); setActiveMenuId(null); }}
                          className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Hapus
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* EMV Card Chip Visual for Realism */}
                <div className="relative z-10 w-8 h-6 sm:w-9 sm:h-7 bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 rounded-md border border-yellow-500/20 shadow-sm shrink-0 self-start select-none mt-2 sm:mt-0">
                  <div className="absolute inset-x-1.5 top-0 bottom-0 border-l border-r border-amber-900/10"></div>
                  <div className="absolute inset-y-1 left-0 right-0 border-t border-b border-amber-900/10"></div>
                </div>

                <div className="relative z-10 mt-1 sm:mt-2">
                  <p className="text-[9px] sm:text-[10px] font-bold text-white/50 uppercase tracking-widest leading-none">Available Balance</p>
                  <h3 className="text-2xl sm:text-4xl font-extrabold mt-1 sm:mt-1.5 tracking-tight">Rp {acc.balance.toLocaleString("id-ID")}</h3>
                </div>

                <div className="relative z-10 flex justify-between items-end border-t border-white/10 pt-3 sm:pt-4 mt-1 sm:mt-2">
                  <div className="min-w-0">
                    <p className="text-[8px] sm:text-[9px] font-bold text-white/40 uppercase tracking-wide">Account Holder</p>
                    <p className="font-extrabold text-xs sm:text-sm tracking-wide mt-0.5 truncate">{acc.holder || "AKHMAD MAARIZ"}</p>
                  </div>
                  {/* Card Brand */}
                  <span className="text-[9px] sm:text-[10px] font-black tracking-widest text-white/30 uppercase italic shrink-0">GPN</span>
                </div>

                {/* Glowing light highlight */}
                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl opacity-40 group-hover:scale-110 transition-transform duration-500"></div>
              </div>
            );
          }

          // Mandiri Card (Luxurious Dark Black Card Theme)
          if (acc.type === "bank-dark") {
            return (
              <div 
                key={acc.id} 
                className="bg-gradient-to-br from-[#1E1E1E] via-[#2F2F2F] to-[#121212] p-5 xs:p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] text-white flex flex-col justify-between h-64 sm:h-72 shadow-xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl group border border-white/5"
                style={{ animationDelay: `${(index + 1) * 80}ms` }}
              >
                <div className="relative z-10 flex justify-between items-start">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/80 border border-white/5 shrink-0">
                      <CreditCard className="w-5.5 h-5.5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-base sm:text-lg tracking-wide uppercase leading-none truncate">{acc.name}</h4>
                      <div className="flex items-center gap-1.5 mt-1 select-none">
                        <span className="text-[10px] sm:text-xs text-white/40 font-mono tracking-wider">{acc.number}</span>
                        <button 
                          onClick={() => handleCopy(acc.id, acc.number)}
                          className="p-1 hover:bg-white/15 rounded text-white/30 hover:text-white transition cursor-pointer"
                          title="Salin Nomor Rekening"
                        >
                          {copiedId === acc.id ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Options Menu */}
                  <div className="relative">
                    <button 
                      onClick={() => toggleMenu(acc.id)}
                      className="text-white/20 hover:text-white transition p-1.5 hover:bg-white/10 rounded-xl cursor-pointer"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    
                    {activeMenuId === acc.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white rounded-2xl shadow-2xl border border-slate-100 py-1.5 z-20 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                        <button 
                          onClick={() => { openEditModal(acc); setActiveMenuId(null); }}
                          className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5 text-[#00685F]" /> Ubah
                        </button>
                        <button 
                          onClick={() => { handleDelete(acc.id); setActiveMenuId(null); }}
                          className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Hapus
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* EMV Card Chip Visual for Realism */}
                <div className="relative z-10 w-8 h-6 sm:w-9 sm:h-7 bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 rounded-md border border-yellow-500/20 shadow-sm shrink-0 self-start select-none mt-2 sm:mt-0">
                  <div className="absolute inset-x-1.5 top-0 bottom-0 border-l border-r border-amber-900/10"></div>
                  <div className="absolute inset-y-1 left-0 right-0 border-t border-b border-amber-900/10"></div>
                </div>

                <div className="mt-1 sm:mt-2">
                  <p className="text-[9px] sm:text-[10px] font-bold text-white/30 uppercase tracking-widest leading-none">Total Savings</p>
                  <h3 className="text-2xl sm:text-4xl font-extrabold mt-1 sm:mt-1.5 tracking-tight">Rp {acc.balance.toLocaleString("id-ID")}</h3>
                </div>

                <div className="flex justify-between items-center pt-2 mt-1 sm:mt-2">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl select-none shrink-0">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-[8px] sm:text-[9px] font-bold text-white/60 uppercase">Status: {acc.status || "Active"}</span>
                  </div>
                  {/* MasterCard Card logo */}
                  <div className="flex gap-0.5 select-none opacity-40 group-hover:opacity-75 transition-opacity shrink-0">
                    <div className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 bg-red-500 rounded-full"></div>
                    <div className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 bg-amber-500 rounded-full -ml-2.5 sm:-ml-3"></div>
                  </div>
                </div>

                {/* Silver card reflection highlight */}
                <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full blur-3xl opacity-45 group-hover:scale-105 transition-transform duration-500"></div>
              </div>
            );
          }

          // Wallet card (Premium Crisp White Layout)
          if (acc.type === "wallet") {
            return (
              <div 
                key={acc.id} 
                className="bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-56 sm:h-64 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
                style={{ animationDelay: `${(index + 1) * 80}ms` }}
              >
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-11 h-11 sm:w-14 sm:h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-[#00685F] shadow-inner shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1">
                      <Smartphone className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-base sm:text-xl text-slate-900 tracking-tight leading-tight truncate">{acc.name}</h4>
                      <span className="bg-[#00685F]/10 text-[#00685F] text-[9px] sm:text-[10px] font-black px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-tighter mt-1 inline-block select-none shrink-0">
                        {acc.label || "E-Wallet"}
                      </span>
                    </div>
                  </div>
                  
                  {/* Options Menu */}
                  <div className="relative">
                    <button 
                      onClick={() => toggleMenu(acc.id)}
                      className="text-slate-300 hover:text-slate-500 transition p-1.5 hover:bg-slate-50 rounded-xl cursor-pointer"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    
                    {activeMenuId === acc.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white rounded-2xl shadow-2xl border border-slate-100 py-1.5 z-20 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                        <button 
                          onClick={() => { openEditModal(acc); setActiveMenuId(null); }}
                          className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5 text-[#00685F]" /> Ubah
                        </button>
                        <button 
                          onClick={() => { handleDelete(acc.id); setActiveMenuId(null); }}
                          className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Hapus
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-end relative z-10 mt-2">
                  <div className="min-w-0">
                    <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Balance</p>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1.5 truncate">Rp {acc.balance.toLocaleString("id-ID")}</h3>
                  </div>
                  <div className="flex -space-x-2.5 select-none shrink-0">
                    {(acc.wallets || ["GP", "OV"]).map((w, wIdx) => (
                      <div 
                        key={wIdx} 
                        className={`w-7.5 h-7.5 sm:w-8 sm:h-8 border-2 border-white rounded-full flex items-center justify-center text-[7px] sm:text-[8px] font-black uppercase tracking-tighter shadow-sm transition-transform duration-300 group-hover:translate-x-0.5 ${
                          wIdx === 0 ? "bg-slate-100 text-slate-400" : "bg-[#00685F] text-white"
                        }`}
                      >
                        {w}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subtle soft backdrop highlight */}
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#00685F]/5 rounded-tl-[5rem] transition-transform duration-500 group-hover:scale-105"></div>
              </div>
            );
          }

          // Cash card (Premium Crisp White Layout with Clock/History)
          return (
            <div 
              key={acc.id} 
              className="bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-56 sm:h-64 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
              style={{ animationDelay: `${(index + 1) * 80}ms` }}
            >
              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-11 h-11 sm:w-14 sm:h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 shadow-inner shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-1">
                    <Banknote className="w-6 h-6 sm:w-7 sm:h-7 text-slate-400" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-base sm:text-xl text-slate-900 tracking-tight leading-tight truncate">{acc.name}</h4>
                    <span className="bg-gray-100 text-gray-500 text-[9px] sm:text-[10px] font-black px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-tighter mt-1 inline-block select-none shrink-0">
                      {acc.label || "Cash"}
                    </span>
                  </div>
                </div>
                
                {/* Options Menu */}
                <div className="relative">
                  <button 
                    onClick={() => toggleMenu(acc.id)}
                    className="text-slate-300 hover:text-slate-500 transition p-1.5 hover:bg-slate-50 rounded-xl cursor-pointer"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  
                  {activeMenuId === acc.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-2xl shadow-2xl border border-slate-100 py-1.5 z-20 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                      <button 
                        onClick={() => { openEditModal(acc); setActiveMenuId(null); }}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5 text-[#00685F]" /> Ubah
                      </button>
                      <button 
                        onClick={() => { handleDelete(acc.id); setActiveMenuId(null); }}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-2">
                <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">In Hand</p>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1.5 truncate">Rp {acc.balance.toLocaleString("id-ID")}</h3>
              </div>
              
              <div className="flex justify-between items-center text-[8px] sm:text-[10px] font-bold text-gray-300 border-t border-slate-50 pt-3 sm:pt-4 mt-2 select-none relative z-10">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Terakhir Update</span>
                <span className="text-slate-400">{acc.lastUpdated || "Hari ini, 08:45"}</span>
              </div>

              {/* Soft background pattern */}
              <div className="absolute right-0 bottom-0 w-32 h-32 bg-slate-50 rounded-tl-[5rem] transition-transform duration-500 group-hover:scale-105"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
