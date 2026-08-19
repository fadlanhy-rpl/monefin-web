"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import ReportsHeader  from "../../../components/reports/ReportsHeader";
import ReportsOverview from "../../../components/reports/ReportsOverview";
import ReportsCharts  from "../../../components/reports/ReportsCharts";
import ReportsTable   from "../../../components/reports/ReportsTable";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { getReportCompare, getReportCategoryBreakdown, exportReportCSV } from "../../../services/report.service";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../../context/LanguageContext";

// ── Utility: derive YYYY-MM from preset id ────────────────────────────────────
function getPresetRange(presetId) {
  const now = new Date();
  const y   = now.getFullYear();
  const m   = String(now.getMonth() + 1).padStart(2, "0");

  switch (presetId) {
    case "this_month": return { start_month: `${y}-${m}`, end_month: `${y}-${m}` };
    case "3_months": {
      const s = new Date(now); s.setMonth(s.getMonth() - 2);
      return {
        start_month: `${s.getFullYear()}-${String(s.getMonth() + 1).padStart(2, "0")}`,
        end_month:   `${y}-${m}`,
      };
    }
    case "6_months": {
      const s = new Date(now); s.setMonth(s.getMonth() - 5);
      return {
        start_month: `${s.getFullYear()}-${String(s.getMonth() + 1).padStart(2, "0")}`,
        end_month:   `${y}-${m}`,
      };
    }
    case "this_year": return { start_month: `${y}-01`, end_month: `${y}-12` };
    default:           return { start_month: `${y}-${m}`, end_month: `${y}-${m}` };
  }
}

export default function ReportsPage() {
  const router = useRouter();
  const { language } = useLanguage();

  // ── UI state ────────────────────────────────────────────────────────────────
  const [isVisible,  setIsVisible]  = useState(false);
  const [toast,      setToast]      = useState({ message: "", type: "success" });

  // ── Filter state ────────────────────────────────────────────────────────────
  const [activePreset, setActivePreset] = useState("6_months");
  const [filterRange,  setFilterRange]  = useState(() => getPresetRange("6_months"));
  const [customStart,  setCustomStart]  = useState("");
  const [customEnd,    setCustomEnd]    = useState("");

  // ── Data state ──────────────────────────────────────────────────────────────
  const [loading,      setLoading]      = useState(true);
  const [monthlyData,  setMonthlyData]  = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [summary,      setSummary]      = useState({
    total_income: 0, total_expense: 0, net_savings: 0, saving_rate: 0,
  });

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 3500);
  };

  // ── Fetch all report data ────────────────────────────────────────────────────
  const fetchReportData = useCallback(async (range) => {
    setLoading(true);
    try {
      const [compareRes, catRes] = await Promise.all([
        getReportCompare({ start_month: range.start_month, end_month: range.end_month }),
        getReportCategoryBreakdown({
          start_date: range.start_month ? range.start_month + "-01" : undefined,
          end_date:   range.end_month   ? range.end_month + "-31"   : undefined,
          type: "expense",
        }),
      ]);

      setMonthlyData(compareRes.data  || []);
      setSummary(compareRes.summary   || {});
      setCategoryData(catRes.data     || []);
    } catch (err) {
      console.error("Failed to load report data:", err);
      showToast(language === 'en' ? "Failed to load report data. Please try again." : "Gagal memuat data laporan. Silakan coba lagi.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── On mount ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    setIsVisible(true);
    fetchReportData(filterRange);
  }, []);

  // ── Preset chip changed ───────────────────────────────────────────────────────
  const handlePresetChange = (presetId, range) => {
    setActivePreset(presetId);
    setFilterRange(range);
    setCustomStart("");
    setCustomEnd("");
    fetchReportData(range);
  };

  // ── Custom date range applied ─────────────────────────────────────────────────
  const handleCustomRangeChange = (start, end) => {
    setActivePreset("custom");
    setCustomStart(start);
    setCustomEnd(end);
    const range = { start_month: start, end_month: end };
    setFilterRange(range);
    fetchReportData(range);
  };

  // ── Export Excel (.xlsx) ──────────────────────────────────────────────────────
  const handleExportCSV = () => {
    showToast(language === 'en' ? "Preparing professional financial report Excel file..." : "Menyiapkan file Excel laporan keuangan profesional...");
    exportReportCSV({
      start_date: filterRange.start_month ? filterRange.start_month + "-01" : undefined,
      end_date:   filterRange.end_month   ? filterRange.end_month   + "-31" : undefined,
    });
  };

  // ── New transaction ────────────────────────────────────────────────────────────
  const handleNewTransaction = () => {
    router.push("/transactions");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 min-w-0">

        {/* Header + Filter */}
        <ReportsHeader
          isVisible={isVisible}
          onNewTransaction={handleNewTransaction}
          onExportCSV={handleExportCSV}
          activePreset={activePreset}
          onPresetChange={handlePresetChange}
          customStart={customStart}
          customEnd={customEnd}
          onCustomRangeChange={handleCustomRangeChange}
          loading={loading}
        />

        {/* Overview Cards */}
        <div className={`transition-all duration-700 delay-100 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <ReportsOverview
            totalIncome={summary.total_income}
            totalExpense={summary.total_expense}
            netSavings={summary.net_savings}
            savingRate={summary.saving_rate}
            monthlyData={monthlyData}
            loading={loading}
          />
        </div>

        {/* Charts Section */}
        <div className={`transition-all duration-700 delay-200 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <ReportsCharts
            monthlyData={monthlyData}
            categoryData={categoryData}
            loading={loading}
          />
        </div>

        {/* Table */}
        <div className={`transition-all duration-700 delay-300 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <ReportsTable monthlyData={monthlyData} loading={loading} />
        </div>

      </div>

      {/* Toast Notification */}
      {toast.message && (
        <div className={`fixed bottom-6 right-6 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-5 duration-300 z-50 border ${
          toast.type === "error"
            ? "bg-red-900/95 border-red-800"
            : "bg-slate-900/95 border-slate-800"
        }`}>
          {toast.type === "error"
            ? <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            : <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}
    </DashboardLayout>
  );
}
