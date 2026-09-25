"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Receipt, 
  Plus, 
  Target, 
  Menu, 
  X, 
  Camera, 
  PiggyBank, 
  ArrowRight,
  TrendingDown
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function MobileBottomNav({ setMobileOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, language } = useLanguage();
  const isEn = language === "en";

  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  const isActive = (path) => {
    if (!pathname) return false;
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  const handleQuickAction = (route) => {
    setIsQuickActionOpen(false);
    router.push(route);
  };

  return (
    <>
      {/* Quick Action Bottom Sheet Overlay */}
      {isQuickActionOpen && (
        <div 
          onClick={() => setIsQuickActionOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Quick Action Sheet Modal */}
      {isQuickActionOpen && (
        <div className="fixed bottom-20 inset-x-3 z-50 md:hidden bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-5 shadow-2xl animate-in slide-in-from-bottom-5 duration-200 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              {isEn ? "Quick Actions" : "Aksi Cepat Finansial"}
            </span>
            <button
              type="button"
              onClick={() => setIsQuickActionOpen(false)}
              className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickAction("/transactions")}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/60 hover:bg-rose-50 border border-rose-100 text-left transition active:scale-98 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {isEn ? "Record Transaction" : "Catat Transaksi"}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {isEn ? "Log income or daily expense" : "Pemasukan atau pengeluaran baru"}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickAction("/transactions")}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-teal-50/60 hover:bg-teal-50 border border-teal-100 text-left transition active:scale-98 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00685F] text-white flex items-center justify-center shadow-xs">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {isEn ? "Scan Receipt" : "Pindai Struk Belanja"}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {isEn ? "Extract receipt with AI instantly" : "Foto bon langsung jadi data transaksi"}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickAction("/goals")}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-100 text-left transition active:scale-98 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <PiggyBank className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {isEn ? "New Savings Goal" : "Buat Target Tabungan"}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {isEn ? "Plan emergency fund or dream assets" : "Rencanakan dana darurat / impian"}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      )}

      {/* Main Fixed Bottom Navigation Bar (Mobile Only: < md) */}
      <nav 
        aria-label="Mobile Navigation"
        className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] px-2 pt-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom))]"
      >
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {/* Tab 1: Dashboard */}
          <Link
            href="/dashboard"
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 min-w-[56px] min-h-[48px] select-none ${
              isActive("/dashboard")
                ? "text-[#00685F] font-black"
                : "text-slate-400 hover:text-slate-700 font-semibold"
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${isActive("/dashboard") ? "bg-[#00685F]/10 scale-105" : ""}`}>
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">
              {isEn ? "Home" : "Beranda"}
            </span>
          </Link>

          {/* Tab 2: Transactions */}
          <Link
            href="/transactions"
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 min-w-[56px] min-h-[48px] select-none ${
              isActive("/transactions")
                ? "text-[#00685F] font-black"
                : "text-slate-400 hover:text-slate-700 font-semibold"
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${isActive("/transactions") ? "bg-[#00685F]/10 scale-105" : ""}`}>
              <Receipt className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">
              {isEn ? "Txns" : "Transaksi"}
            </span>
          </Link>

          {/* Center FAB Button: Quick Actions */}
          <div className="flex flex-col items-center justify-center -mt-5">
            <button
              type="button"
              onClick={() => setIsQuickActionOpen((v) => !v)}
              aria-label={isEn ? "Quick Actions" : "Aksi Cepat"}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-90 cursor-pointer ${
                isQuickActionOpen
                  ? "bg-slate-800 rotate-45 shadow-slate-800/30"
                  : "bg-gradient-to-br from-[#00685F] to-[#004D46] shadow-[#00685F]/40 ring-4 ring-white"
              }`}
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
            <span className="text-[9px] font-bold text-slate-500 mt-1 select-none">
              {isEn ? "Add" : "Catat"}
            </span>
          </div>

          {/* Tab 4: Goals */}
          <Link
            href="/goals"
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 min-w-[56px] min-h-[48px] select-none ${
              isActive("/goals")
                ? "text-[#00685F] font-black"
                : "text-slate-400 hover:text-slate-700 font-semibold"
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${isActive("/goals") ? "bg-[#00685F]/10 scale-105" : ""}`}>
              <Target className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">
              {isEn ? "Goals" : "Target"}
            </span>
          </Link>

          {/* Tab 5: Menu Drawer (Opens complete Sidebar) */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl text-slate-400 hover:text-slate-700 font-semibold transition-all duration-200 min-w-[56px] min-h-[48px] cursor-pointer select-none"
          >
            <div className="p-1 rounded-xl">
              <Menu className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">
              {isEn ? "Menu" : "Menu"}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
