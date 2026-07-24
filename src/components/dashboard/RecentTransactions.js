"use client";

import { useEffect, useState, useRef } from "react";
import { Utensils, Wallet, Car, ShoppingBag, Eye } from "lucide-react";

function formatRupiah(n) {
  const abs = Math.abs(n).toLocaleString('id-ID');
  return (n < 0 ? '- ' : '+ ') + 'Rp ' + abs;
}

export default function RecentTransactions() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const transactions = [
    { 
      id: 1, 
      date: '24 Okt 2023', 
      category: 'Food & Beverage', 
      tag: 'expense', 
      amount: -120000,
      icon: <Utensils className="w-4 h-4 text-emerald-600" />,
      iconBg: 'bg-emerald-50'
    },
    { 
      id: 2, 
      date: '23 Okt 2023', 
      category: 'Gaji Bulanan', 
      tag: 'income', 
      amount: 8000000,
      icon: <Wallet className="w-4 h-4 text-brand-600" />,
      iconBg: 'bg-brand-50'
    },
    { 
      id: 3, 
      date: '22 Okt 2023', 
      category: 'Transportasi', 
      tag: 'expense', 
      amount: -45000,
      icon: <Car className="w-4 h-4 text-blue-600" />,
      iconBg: 'bg-blue-50'
    },
    { 
      id: 4, 
      date: '21 Okt 2023', 
      category: 'Shopping', 
      tag: 'expense', 
      amount: -450000,
      icon: <ShoppingBag className="w-4 h-4 text-orange-600" />,
      iconBg: 'bg-orange-50'
    },
  ];

  const filteredTransactions = transactions.filter(t => {
    if (activeFilter === "all") return true;
    return t.tag === activeFilter;
  });

  return (
    <div ref={ref} className={`reveal card-hover xl:col-span-2 bg-white rounded-2xl p-5 sm:p-6 shadow-card border border-slate-100/50 ${isVisible ? 'in-view' : ''}`} style={{ animationDelay: "340ms" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-slate-900 text-lg">Recent Transactions</h2>
          <p className="text-xs text-slate-400 mt-0.5">Daftar transaksi mutakhir di seluruh rekening</p>
        </div>
        
        {/* View all button */}
        <button className="ripple-container press-scale text-xs font-bold text-brand-700 bg-brand-50 px-3.5 py-2 rounded-xl hover:bg-brand-100 transition-colors flex items-center gap-1.5 self-start sm:self-auto">
          <Eye className="w-3.5 h-3.5" />
          Lihat Semua
        </button>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-1.5 mt-5 border-b border-slate-100 pb-3 overflow-x-auto flex-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] select-none">
        {['all', 'income', 'expense'].map((filter) => {
          const isActive = activeFilter === filter;
          const label = filter === 'all' ? 'Semua' : filter === 'income' ? 'Pemasukan' : 'Pengeluaran';
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                isActive 
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/15' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm min-w-[480px]">
          <thead>
            <tr className="text-left text-[11px] tracking-wider text-slate-400 font-semibold">
              <th className="pb-3 font-semibold">TANGGAL</th>
              <th className="pb-3 font-semibold">KATEGORI</th>
              <th className="pb-3 font-semibold text-right">JUMLAH</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((t, i) => {
                const amountClass = t.amount < 0 ? 'text-red-500' : 'text-brand-700';
                return (
                  <tr 
                    key={t.id} 
                    className={`txn-row text-slate-700 reveal ${isVisible ? 'in-view' : ''}`} 
                    style={{ animationDelay: `${420 + i * 60}ms` }}
                  >
                    <td className="py-4 whitespace-nowrap text-slate-500 font-medium">{t.date}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${t.iconBg} flex items-center justify-center`}>
                          {t.icon}
                        </div>
                        <span className="font-semibold text-slate-800">{t.category}</span>
                      </div>
                    </td>
                    <td className={`py-4 text-right font-bold ${amountClass} whitespace-nowrap`}>
                      {formatRupiah(t.amount)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="3" className="py-8 text-center text-sm text-slate-400 font-medium">
                  Tidak ada transaksi untuk filter ini
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
