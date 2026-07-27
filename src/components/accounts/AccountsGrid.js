import { Landmark, CreditCard, Smartphone, Banknote, MoreVertical, Clock, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

export default function AccountsGrid({
  accounts,
  openEditModal,
  handleDelete
}) {
  // Simple drop-menu popups state per card
  const [activeMenuId, setActiveMenuId] = useState(null);

  const toggleMenu = (id) => {
    if (activeMenuId === id) {
      setActiveMenuId(null);
    } else {
      setActiveMenuId(id);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {accounts.map((acc, index) => {
        // BCA theme
        if (acc.type === "bank-primary") {
          return (
            <div 
              key={acc.id} 
              className="bg-[#00685F] p-8 rounded-[2.5rem] text-white flex flex-col justify-between h-72 shadow-2xl shadow-[#00685F]/30 relative overflow-hidden transition-transform hover:-translate-y-1 group"
              style={{ animationDelay: `${(index + 1) * 80}ms` }}
            >
              <div className="relative z-10 flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                    <Landmark className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg tracking-wide uppercase">{acc.name}</h4>
                    <p className="text-xs text-white/60 font-mono">{acc.number}</p>
                  </div>
                </div>
                
                {/* Options button */}
                <div className="relative">
                  <button 
                    onClick={() => toggleMenu(acc.id)}
                    className="text-white/40 hover:text-white transition p-1 hover:bg-white/10 rounded-lg cursor-pointer"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  
                  {activeMenuId === acc.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-50 py-1.5 z-20 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                      <button 
                        onClick={() => { openEditModal(acc); setActiveMenuId(null); }}
                        className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5 text-[#00685F]" /> Ubah
                      </button>
                      <button 
                        onClick={() => { handleDelete(acc.id); setActiveMenuId(null); }}
                        className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Available Balance</p>
                <h3 className="text-4xl font-extrabold mt-2 tracking-tight">Rp {acc.balance.toLocaleString("id-ID")}</h3>
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-bold text-white/40 uppercase">Account Holder</p>
                <p className="font-bold text-lg tracking-tight">{acc.holder || "Holder Name"}</p>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl opacity-50"></div>
            </div>
          );
        }

        // Mandiri / Dark theme
        if (acc.type === "bank-dark") {
          return (
            <div 
              key={acc.id} 
              className="bg-[#2D2D2D] p-8 rounded-[2.5rem] text-white flex flex-col justify-between h-72 shadow-xl relative transition-transform hover:-translate-y-1 group"
              style={{ animationDelay: `${(index + 1) * 80}ms` }}
            >
              <div className="relative z-10 flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/70">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg tracking-wide uppercase">{acc.name}</h4>
                    <p className="text-xs text-white/30 font-mono">{acc.number}</p>
                  </div>
                </div>
                
                {/* Options button */}
                <div className="relative">
                  <button 
                    onClick={() => toggleMenu(acc.id)}
                    className="text-white/20 hover:text-white transition p-1 hover:bg-white/10 rounded-lg cursor-pointer"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  
                  {activeMenuId === acc.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-50 py-1.5 z-20 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                      <button 
                        onClick={() => { openEditModal(acc); setActiveMenuId(null); }}
                        className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5 text-[#00685F]" /> Ubah
                      </button>
                      <button 
                        onClick={() => { handleDelete(acc.id); setActiveMenuId(null); }}
                        className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Total Savings</p>
                <h3 className="text-4xl font-extrabold mt-2 tracking-tight">Rp {acc.balance.toLocaleString("id-ID")}</h3>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl self-start select-none">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-white/60 uppercase">Status: {acc.status || "Active"}</span>
              </div>
            </div>
          );
        }

        // Wallet theme
        if (acc.type === "wallet") {
          return (
            <div 
              key={acc.id} 
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-64 hover:shadow-md transition-shadow group relative"
              style={{ animationDelay: `${(index + 1) * 80}ms` }}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-[#00685F] shadow-inner shrink-0">
                    <Smartphone className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-slate-900 tracking-tight leading-tight">{acc.name}</h4>
                    <span className="bg-[#00685F]/10 text-[#00685F] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter mt-1 inline-block select-none">
                      {acc.label || "E-Wallet"}
                    </span>
                  </div>
                </div>
                
                {/* Options button */}
                <div className="relative">
                  <button 
                    onClick={() => toggleMenu(acc.id)}
                    className="text-slate-300 hover:text-slate-500 transition p-1 hover:bg-slate-50 rounded-lg cursor-pointer"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  
                  {activeMenuId === acc.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-50 py-1.5 z-20 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                      <button 
                        onClick={() => { openEditModal(acc); setActiveMenuId(null); }}
                        className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5 text-[#00685F]" /> Ubah
                      </button>
                      <button 
                        onClick={() => { handleDelete(acc.id); setActiveMenuId(null); }}
                        className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Balance</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-2">Rp {acc.balance.toLocaleString("id-ID")}</h3>
                </div>
                <div className="flex -space-x-2 select-none">
                  {(acc.wallets || ["GP", "OV"]).map((w, wIdx) => (
                    <div 
                      key={wIdx} 
                      className={`w-8 h-8 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-bold uppercase tracking-tighter shadow-sm ${
                        wIdx === 0 ? "bg-slate-100 text-slate-400" : "bg-[#00685F] text-white"
                      }`}
                    >
                      {w}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        // Cash theme
        return (
          <div 
            key={acc.id} 
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-64 hover:shadow-md transition-shadow group relative"
            style={{ animationDelay: `${(index + 1) * 80}ms` }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 shadow-inner shrink-0">
                  <Banknote className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-xl text-slate-900 tracking-tight leading-tight">{acc.name}</h4>
                  <span className="bg-gray-100 text-gray-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter mt-1 inline-block select-none">
                    {acc.label || "Cash"}
                  </span>
                </div>
              </div>
              
              {/* Options button */}
              <div className="relative">
                <button 
                  onClick={() => toggleMenu(acc.id)}
                  className="text-slate-300 hover:text-slate-500 transition p-1 hover:bg-slate-50 rounded-lg cursor-pointer"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                
                {activeMenuId === acc.id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-50 py-1.5 z-20 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                    <button 
                      onClick={() => { openEditModal(acc); setActiveMenuId(null); }}
                      className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5 text-[#00685F]" /> Ubah
                    </button>
                    <button 
                      onClick={() => { handleDelete(acc.id); setActiveMenuId(null); }}
                      className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">In Hand</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2">Rp {acc.balance.toLocaleString("id-ID")}</h3>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold text-gray-300 border-t border-slate-50 pt-4 select-none">
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Terakhir Update</span>
              <span className="text-slate-400">{acc.lastUpdated || "Hari ini, 08:45"}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
