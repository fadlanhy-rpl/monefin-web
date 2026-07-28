"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import ReportsHeader from "../../../components/reports/ReportsHeader";
import ReportsOverview from "../../../components/reports/ReportsOverview";
import ReportsCharts from "../../../components/reports/ReportsCharts";
import ReportsTable from "../../../components/reports/ReportsTable";
import { CheckCircle2 } from "lucide-react";

export default function ReportsPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  // Monthly performance dataset
  const monthlyData = [
    { month: "Januari 2026", income: 8000000, expense: 3200000, cashflow: 4800000, status: "Surplus" },
    { month: "Februari 2026", income: 8500000, expense: 4100000, cashflow: 4400000, status: "Surplus" },
    { month: "Maret 2026", income: 7800000, expense: 5200000, cashflow: 2600000, status: "Surplus" },
    { month: "April 2026", income: 9200000, expense: 4000000, cashflow: 5200000, status: "Surplus" },
    { month: "Mei 2026", income: 8900000, expense: 3500000, cashflow: 5400000, status: "Surplus" },
    { month: "Juni 2026", income: 10500000, expense: 6000000, cashflow: 4500000, status: "Surplus" },
  ];

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = ["Bulan", "Pemasukan (IDR)", "Pengeluaran (IDR)", "Net Cashflow (IDR)", "Status"];
    const rows = monthlyData.map(row => [
      row.month,
      row.income,
      row.expense,
      row.cashflow,
      row.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Laporan_Keuangan_MoneFin_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("File Laporan_Keuangan_MoneFin_2026.csv berhasil diunduh.");
  };

  // Export PDF Simulation Handler
  const handleExportPDF = () => {
    showToast("Menyiapkan dokumen PDF Laporan Keuangan...");
  };

  // New Transaction Simulation Handler
  const handleNewTransaction = () => {
    showToast("Membuka modal penambahan transaksi baru...");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 min-w-0">
        
        {/* Header Section */}
        <ReportsHeader 
          isVisible={isVisible}
          onNewTransaction={handleNewTransaction}
          onExportPDF={handleExportPDF}
          onExportCSV={handleExportCSV}
        />

        {/* Overview Cards (Net Savings & Saving Rate) */}
        <div className={`transition-all duration-700 delay-100 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <ReportsOverview 
            netSavings={4800000}
            savingRate={60}
            growthPercentage={12.5}
          />
        </div>

        {/* Charts Section (Trends & Donut Distribution) */}
        <div className={`transition-all duration-700 delay-200 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <ReportsCharts />
        </div>

        {/* Table Summary Section */}
        <div className={`transition-all duration-700 delay-300 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <ReportsTable monthlyData={monthlyData} />
        </div>

      </div>

      {/* Dynamic Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-5 duration-300 z-50 border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </DashboardLayout>
  );
}
