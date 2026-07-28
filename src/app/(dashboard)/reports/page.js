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

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const handleAddTransaction = () => {
    showToast("Membuka form Tambah Transaksi baru...");
  };

  const handleExportPDF = () => {
    showToast("Mengunduh Laporan Keuangan (PDF)...");
  };

  const handleExportCSV = () => {
    showToast("Mengunduh Data Laporan Keuangan (CSV)...");
  };

  const handleDetailedLedger = () => {
    showToast("Membuka Rincian Buku Besar (Detailed Ledger)...");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 min-w-0 pb-6">
        
        {/* Header Title and Actions */}
        <div className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <ReportsHeader 
            onAddTransaction={handleAddTransaction}
            onExportPDF={handleExportPDF}
            onExportCSV={handleExportCSV}
          />
        </div>

        {/* Overview Cards (Net Savings & Saving Rate) */}
        <div className={`transition-all duration-700 delay-100 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <ReportsOverview 
            netSavings="Rp 4.800.000"
            growthPercentage="+12.5%"
            savingRate={60}
          />
        </div>

        {/* Charts Section (Trends & Spending Distribution) */}
        <div className={`transition-all duration-700 delay-200 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <ReportsCharts />
        </div>

        {/* Monthly Performance Summary Table */}
        <div className={`transition-all duration-700 delay-300 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <ReportsTable 
            onDetailedLedgerClick={handleDetailedLedger}
          />
        </div>

      </div>

      {/* Dynamic Toast Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-5 duration-300 z-50 border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </DashboardLayout>
  );
}
