"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { getSplitBills, deleteSplitBill, getWhatsAppShareText } from "../../../services/split-bill.service";
import { useLanguage } from "../../../context/LanguageContext";

export function useSplitBillPage() {
  const { t, language } = useLanguage();
  const [bills, setBills] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, settled
  const [modeFilter, setModeFilter] = useState("all"); // all, equal, itemized, percentage, exact
  const [search, setSearch] = useState("");

  // Modals state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedBillId, setSelectedBillId] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getSplitBills({
        status: statusFilter === "all" ? undefined : statusFilter,
        search: search.trim() || undefined,
      });
      setBills(res.data || []);
      setSummary(res.summary || null);
    } catch (err) {
      console.error("Failed to load split bills:", err);
      toast.error(language === "en" ? "Failed to load split bills." : "Gagal memuat daftar pembagian tagihan.");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, search, language]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadData]);

  const handleDelete = async (e, id, title) => {
    e.stopPropagation();
    if (!window.confirm(language === "en" ? `Delete split bill "${title}"?` : `Hapus pembagian tagihan "${title}"?`)) return;
    try {
      await deleteSplitBill(id);
      toast.success(language === "en" ? "Bill deleted successfully." : "Tagihan berhasil dihapus.");
      loadData();
    } catch {
      toast.error(language === "en" ? "Failed to delete bill." : "Gagal menghapus tagihan.");
    }
  };

  const handleShareWA = async (e, billId) => {
    e.stopPropagation();
    try {
      const res = await getWhatsAppShareText(billId);
      const { text, whatsapp_url } = res.data;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        toast.success(language === "en" ? "Bill text copied! Opening WhatsApp..." : "Teks tagihan disalin! Membuka WhatsApp...");
      }
      window.open(whatsapp_url, "_blank");
    } catch {
      toast.error(language === "en" ? "Failed to generate WhatsApp link." : "Gagal memuat link WhatsApp.");
    }
  };

  // Filter bills by split mode
  const filteredBills = useMemo(() => {
    if (modeFilter === "all") return bills;
    return bills.filter((b) => b.split_mode === modeFilter);
  }, [bills, modeFilter]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setModeFilter("all");
  };

  return {
    t,
    language,
    bills,
    filteredBills,
    summary,
    isLoading,
    statusFilter,
    setStatusFilter,
    modeFilter,
    setModeFilter,
    search,
    setSearch,
    resetFilters,
    isWizardOpen,
    setIsWizardOpen,
    selectedBillId,
    setSelectedBillId,
    isDetailOpen,
    setIsDetailOpen,
    loadData,
    handleDelete,
    handleShareWA,
  };
}
