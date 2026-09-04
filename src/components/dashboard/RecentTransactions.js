"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Utensils, Wallet, Car, ShoppingBag, Eye } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../hooks/useCurrency";

export default function RecentTransactions({ transactions = [] }) {
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();
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

  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const formattedTransactions = safeTransactions.map(txn => {
    const d = new Date(txn.transaction_date);
    const dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const tag = txn.type;
    const amt = tag === 'expense' ? -txn.amount : txn.amount;

    let IconComponent = ShoppingBag;
    let iconColor = 'text-orange-600';
    let bgClass = 'bg-orange-50';

    if (tag === 'income') {
      IconComponent = Wallet;
      iconColor = 'text-brand-600';
      bgClass = 'bg-brand-50';
    } else if (txn.category?.name?.toLowerCase().includes('food') || txn.category?.name?.toLowerCase().includes('makanan')) {
      IconComponent = Utensils;
      iconColor = 'text-emerald-600';
      bgClass = 'bg-emerald-50';
    } else if (txn.category?.name?.toLowerCase().includes('transport')) {
      IconComponent = Car;
      iconColor = 'text-blue-600';
      bgClass = 'bg-blue-50';
    }

    return {
      id: txn.id,
      date: dateStr,
      category: txn.category?.name || (t("transactions.unknown") || 'Lain-lain'),
      tag: tag,
      amount: amt,
      icon: <IconComponent className={`w-4 h-4 ${iconColor}`} />,
      iconBg: bgClass
    };
  });

  const filteredTransactions = formattedTransactions.filter(txn => {
    if (activeFilter === "all") return true;
    return txn.tag === activeFilter;
  });

  return (
    <div ref={ref} className={`reveal card-hover xl:col-span-2 bg-white rounded-[1.5rem] sm:rounded-2xl p-4.5 sm:p-6 shadow-card border border-slate-100/50 ${isVisible ? 'in-view' : ''}`} style={{ animationDelay: "340ms" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="font-bold text-slate-900 text-base sm:text-lg">{t("dashboard.recent_transactions") || "Recent Transactions"}</h2>
          <p className="text-xs text-slate-600 mt-0.5">{t("dashboard.recent_transactions_desc") || "Daftar transaksi mutakhir di seluruh rekening"}</p>
        </div>

        {/* View all button */}
        <Link
          href="/transactions"
          className="ripple-container press-scale text-xs font-bold text-brand-700 bg-brand-50 px-3.5 py-2 rounded-xl hover:bg-brand-100 transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{t("dashboard.view_all") || "Lihat Semua"}</span>
        </Link>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-1.5 mt-4 sm:mt-5 border-b border-slate-100 pb-3 overflow-x-auto flex-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] select-none">
        {['all', 'income', 'expense'].map((filter) => {
          const isActive = activeFilter === filter;
          const label = filter === 'all' ? (t("dashboard.all") || 'Semua') : filter === 'income' ? (t("dashboard.income") || 'Pemasukan') : (t("dashboard.expense") || 'Pengeluaran');
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all shrink-0 ${isActive
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/15'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 sm:mt-4 overflow-x-auto">
        <table className="w-full text-sm min-w-[420px]">
          <thead>
            <tr className="text-left text-[10px] sm:text-[11px] tracking-wider text-slate-600 font-semibold">
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
                    <td className="py-3.5 sm:py-4 whitespace-nowrap text-slate-500 font-medium text-xs sm:text-sm">{t.date}</td>
                    <td className="py-3.5 sm:py-4">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${t.iconBg} flex items-center justify-center shrink-0`}>
                          {t.icon}
                        </div>
                        <span className="font-semibold text-slate-800 text-xs sm:text-sm truncate max-w-[150px] sm:max-w-none">{t.category}</span>
                      </div>
                    </td>
                    <td className={`py-3.5 sm:py-4 text-right font-bold ${amountClass} whitespace-nowrap text-xs sm:text-sm`}>
                      {t.amount < 0 ? '- ' : '+ '}
                      {formatCurrency(Math.abs(t.amount))}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="3" className="py-8 text-center text-xs sm:text-sm text-slate-600 font-medium">
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
