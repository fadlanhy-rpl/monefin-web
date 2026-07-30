"use client";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import StatCards from "../../../components/dashboard/StatCards";
import ChartsRow from "../../../components/dashboard/ChartsRow";
import RecentTransactions from "../../../components/dashboard/RecentTransactions";
import SmartInsight from "../../../components/dashboard/SmartInsight";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* HEADING */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Financial Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Here's what's happening with your wealth today.</p>
        </div>
        <button className="press-scale flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 shadow-card self-start hover:border-brand-300 hover:text-brand-700 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          Last 30 Days
        </button>
      </div>

      <StatCards />
      
      <ChartsRow />

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <RecentTransactions />
        <SmartInsight />
      </div>
    </DashboardLayout>
  );
}
