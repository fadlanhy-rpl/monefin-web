"use client";

import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import StatCards from "../../../components/dashboard/StatCards";
import ChartsRow from "../../../components/dashboard/ChartsRow";
import RecentTransactions from "../../../components/dashboard/RecentTransactions";
import SmartInsight from "../../../components/dashboard/SmartInsight";
import { getDashboardSummary } from "../../../services/dashboard.service";
import { Calendar, ChevronDown, Check } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState("30days");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const rangeOptions = [
    { value: "7days", label: "7 Hari Terakhir" },
    { value: "30days", label: "30 Hari Terakhir" },
    { value: "this_month", label: "Bulan Ini" },
    { value: "this_year", label: "Tahun Ini" },
  ];

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await getDashboardSummary({ range: selectedRange });
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Gagal load dashboard", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedRange]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLabel = rangeOptions.find(o => o.value === selectedRange)?.label || "30 Hari Terakhir";

  return (
    <DashboardLayout>
      {/* HEADING */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Financial Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Here's what's happening with your wealth today.</p>
        </div>
        
        {/* Date Filter Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="press-scale flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 shadow-card self-start hover:border-brand-300 hover:text-brand-700 transition-colors"
          >
            <Calendar className="w-4 h-4 text-brand-600" />
            <span>{currentLabel}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
              {rangeOptions.map((opt) => {
                const isSelected = selectedRange === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSelectedRange(opt.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold transition-colors ${
                      isSelected 
                        ? 'text-brand-700 bg-brand-50/70 font-bold' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-brand-600" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-slate-400">Loading dashboard...</div>
      ) : data ? (
        <div className="space-y-6 sm:space-y-8">
          <StatCards 
            totalBalance={data.total_balance} 
            totalIncome={data.total_income_this_month} 
            totalExpense={data.total_expense_this_month} 
          />
          
          <ChartsRow 
            weeklyTrend={data.weekly_trend}
            monthlyTrend={data.monthly_trend}
            categoryData={data.expense_by_category}
          />

          {/* BOTTOM ROW */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <RecentTransactions transactions={data.recent_transactions} />
            <SmartInsight 
              status={data.spending_status} 
              savings={data.savings_this_month} 
            />
          </div>
        </div>
      ) : (
        <div className="text-center text-slate-500 py-10">Gagal memuat data.</div>
      )}
    </DashboardLayout>
  );
}
