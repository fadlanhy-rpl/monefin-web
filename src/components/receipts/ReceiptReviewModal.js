"use client";

import { useState, useMemo, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCw,
  Check,
  Calendar,
  Wallet,
  Tag,
  Store,
  Layers,
  FileText,
  Trash2,
  Plus,
  AlertCircle,
  HardDrive,
  ChevronDown,
  Split,
  Image as ImageIcon
} from "lucide-react";
import { confirmReceiptTransaction } from "../../services/receipt.service";
import { useLanguage } from "../../context/LanguageContext";
import { useCurrency } from "../../hooks/useCurrency";

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ReceiptReviewModal({
  isOpen,
  onClose,
  extractedData,
  imageFile,
  previewUrl,
  accounts = [],
  categories = [],
  onSuccess,
}) {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const { formatCurrency } = useCurrency();

  // Mode: "summary" (Ringkasan) vs "itemized" (Terperinci)
  const [mode, setMode] = useState("summary");

  // Mobile active tab: "preview" vs "form"
  const [mobileTab, setMobileTab] = useState("form");

  // Form Fields
  const [merchant, setMerchant] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [amount, setAmount] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [accountId, setAccountId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [items, setItems] = useState([]);
  const [saveReceiptImage, setSaveReceiptImage] = useState(false); // Default false: hemat kuota hosting
  const [splitByCategory, setSplitByCategory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);

  // Initialize data from extracted Vision LLM output
  useEffect(() => {
    if (extractedData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMerchant(extractedData.merchant || (isEn ? "Store / Merchant" : "Toko Belanja"));
      let initialDate = extractedData.date || new Date().toISOString().split("T")[0];
      if (initialDate && initialDate.includes("-")) {
        const parts = initialDate.split("-");
        if (parts.length === 3 && (Number(parts[0]) < 2024 || Number(parts[0]) > 2030)) {
          initialDate = `${new Date().getFullYear()}-${parts[1]}-${parts[2]}`;
        }
      }
      setTransactionDate(initialDate);
      setAmount(String(extractedData.total || 0));
      setSubtotal(extractedData.subtotal || extractedData.total || 0);
      setTax(extractedData.tax || 0);
      setDiscount(extractedData.discount || 0);

      // Default category
      if (extractedData.suggested_category_id) {
        setCategoryId(String(extractedData.suggested_category_id));
      } else if (categories.length > 0) {
        setCategoryId(String(categories[0].id));
      }

      // Default account
      if (accounts.length > 0) {
        setAccountId(String(accounts[0].id));
      }

      // Items list
      if (Array.isArray(extractedData.items) && extractedData.items.length > 0) {
        setItems(
          extractedData.items.map((it, idx) => ({
            id: `item_${idx}_${Date.now()}`,
            name: it.name || `Item ${idx + 1}`,
            qty: Number(it.qty) || 1,
            price: Number(it.price) || 0,
            total: Number(it.total) || (Number(it.qty) || 1) * (Number(it.price) || 0),
            category_id: it.category_id ? String(it.category_id) : "",
          }))
        );
      } else {
        setItems([]);
      }
    }
  }, [extractedData, categories, accounts]);

  // Calculate items sum — must be BEFORE the early return (Rules of Hooks)
  const itemsSum = useMemo(() => {
    return items.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
  }, [items]);

  // Check if items sum matches grand total — must be BEFORE the early return (Rules of Hooks)
  const hasMismatch = useMemo(() => {
    if (mode !== "itemized" || items.length === 0) return false;
    const currentTotal = Number(amount) || 0;
    const calculated = itemsSum + Number(tax) - Number(discount);
    return Math.abs(currentTotal - calculated) > 100; // toleransi 100 perak
  }, [mode, items, itemsSum, amount, tax, discount]);

  if (!isOpen || !extractedData || !mounted) return null;

  // Thousand formatter
  const formatRupiah = (val) => {
    const num = Math.round(Number(val) || 0);
    return new Intl.NumberFormat("id-ID").format(num);
  };



  // Recalculate total from items in itemized mode
  const syncTotalFromItems = () => {
    const newTotal = Math.max(0, itemsSum + Number(tax) - Number(discount));
    setAmount(String(newTotal));
    setSubtotal(itemsSum);
  };

  // Update single item field
  const handleItemChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === "qty" || field === "price") {
          const q = field === "qty" ? Number(value) || 0 : item.qty;
          const p = field === "price" ? Number(value) || 0 : item.price;
          updated.total = q * p;
        }
        return updated;
      })
    );
  };

  // Remove item
  const handleRemoveItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Add new manual item row
  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item_manual_${Date.now()}`,
        name: "",
        qty: 1,
        price: 0,
        total: 0,
        category_id: categoryId || (categories[0]?.id ? String(categories[0].id) : ""),
      },
    ]);
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accountId) {
      setErrorMsg(isEn ? "Please select a funding account." : "Mohon pilih rekening sumber dana.");
      return;
    }
    if (!categoryId) {
      setErrorMsg(isEn ? "Please select a transaction category." : "Mohon pilih kategori transaksi.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setErrorMsg(isEn ? "Transaction amount must be greater than 0." : "Nominal transaksi harus lebih dari 0.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const payload = {
        account_id: Number(accountId),
        category_id: Number(categoryId),
        type: "expense",
        amount: Number(amount),
        description: merchant.trim() || (isEn ? "Receipt Expense" : "Belanja Struk"),
        transaction_date: transactionDate,
        save_receipt_image: saveReceiptImage,
        save_mode: mode,
        merchant: merchant.trim(),
        subtotal: Number(subtotal),
        tax: Number(tax),
        discount: Number(discount),
        items: mode === "itemized" ? items : [],
        split_by_category: splitByCategory,
      };

      const res = await confirmReceiptTransaction(
        payload,
        saveReceiptImage ? imageFile : null
      );

      if (res?.success) {
        if (onSuccess) onSuccess(res.data);
        onClose();
      } else {
        throw new Error(res?.message || (isEn ? "Failed to save transaction." : "Gagal mencatat transaksi."));
      }
    } catch (err) {
      console.error("Confirm receipt transaction error:", err);
      setErrorMsg(
        err?.data?.message || err?.message || (isEn ? "An error occurred while saving the transaction." : "Terjadi kesalahan saat menyimpan transaksi.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen min-h-[100dvh] bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Click outside backdrop */}
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[92vh] overflow-hidden relative z-10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00685F] animate-pulse" />
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {t("receipts.review_title", isEn ? "Confirm & Review Shopping Receipt" : "Konfirmasi & Review Struk Belanja")}
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {t("receipts.review_subtitle", isEn ? "Verify scanned data before saving to transaction history" : "Periksa data hasil pembacaan sebelum disimpan ke riwayat transaksi")}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            type="button"
            className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex md:hidden border-b border-slate-100 bg-white shrink-0">
          <button
            type="button"
            onClick={() => setMobileTab("form")}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition ${
              mobileTab === "form"
                ? "border-[#00685F] text-[#00685F]"
                : "border-transparent text-slate-500"
            }`}
          >
            {t("receipts.tab_form", isEn ? "Transaction Form" : "Form Transaksi")}
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("preview")}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition ${
              mobileTab === "preview"
                ? "border-[#00685F] text-[#00685F]"
                : "border-transparent text-slate-500"
            }`}
          >
            {t("receipts.tab_preview", isEn ? "Receipt Photo" : "Foto Struk")} ({Math.round(zoomLevel * 100)}%)
          </button>
        </div>

        {/* Body (Split Screen Desktop) */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0">
          {/* LEFT: Receipt Image Viewer with Zoom/Pan */}
          <div
            className={`md:col-span-5 bg-slate-900 flex flex-col border-b md:border-b-0 md:border-r border-slate-800 ${
              mobileTab === "preview" ? "flex" : "hidden md:flex"
            }`}
          >
            {/* Toolbar */}
            <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-slate-300 text-xs shrink-0">
              <span className="font-bold flex items-center gap-1.5 text-slate-400">
                <ImageIcon className="w-4 h-4 text-[#00685F]" />
                {t("receipts.proof_label", isEn ? "Receipt Proof" : "Bukti Struk")}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition"
                  title={t("receipts.zoom_out", isEn ? "Zoom Out" : "Perkecil")}
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono px-1 font-bold text-slate-400">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(3, z + 0.2))}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition"
                  title={t("receipts.zoom_in", isEn ? "Zoom In" : "Perbesar")}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition ml-1"
                  title={t("receipts.rotate", isEn ? "Rotate 90°" : "Putar 90°")}
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setZoomLevel(1);
                    setRotation(0);
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition text-[11px] font-bold"
                  title={t("receipts.reset", isEn ? "Reset" : "Reset")}
                >
                  {t("receipts.reset", isEn ? "Reset" : "Reset")}
                </button>
              </div>
            </div>

            {/* Image Canvas Container */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950/50">
              {previewUrl ? (
                <div
                  className="transition-transform duration-200 ease-out origin-center"
                  style={{
                    transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt={isEn ? "Receipt Photo" : "Foto Struk"}
                    className="max-h-[60vh] md:max-h-[70vh] rounded-lg shadow-2xl object-contain border border-slate-700/50"
                  />
                </div>
              ) : (
                <div className="text-center text-slate-500 text-xs">
                  {t("receipts.no_image_preview", isEn ? "No image preview available." : "Tidak ada pratinjau gambar.")}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Verification & Confirmation Form */}
          <form
            onSubmit={handleSubmit}
            className={`md:col-span-7 flex flex-col overflow-hidden ${
              mobileTab === "form" ? "flex" : "hidden md:flex"
            }`}
          >
            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {/* Error Message */}
              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Mode Switcher: Ringkasan vs Terperinci */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {t("receipts.mode_label", isEn ? "Transaction Recording Mode" : "Mode Pencatatan Transaksi")}
                </label>
                <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl gap-1">
                  <button
                    type="button"
                    onClick={() => setMode("summary")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      mode === "summary"
                        ? "bg-white text-[#00685F] shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{t("receipts.mode_summary", isEn ? "Summary (Single Entry)" : "Ringkasan (Satu Catatan)")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("itemized")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      mode === "itemized"
                        ? "bg-white text-[#00685F] shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{t("receipts.mode_itemized", isEn ? "Itemized" : "Terperinci")} ({items.length} {isEn ? "Items" : "Item"})</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  {mode === "summary"
                    ? (isEn ? "Records 1 total expense under the merchant name. Fast and practical." : "Mencatat 1 total pengeluaran atas nama merchant. Praktis dan cepat.")
                    : (isEn ? "Saves details of each purchased item with unit prices." : "Menyimpan rincian tiap barang belanjaan beserta harga satuannya.")}
                </p>
              </div>

              {/* Basic Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Merchant / Nama Toko */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Store className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t("receipts.merchant_label", isEn ? "Store / Merchant Name" : "Nama Toko / Merchant")}</span>
                  </label>
                  <input
                    type="text"
                    value={merchant}
                    onChange={(e) => setMerchant(e.target.value)}
                    placeholder={t("receipts.merchant_placeholder", isEn ? "e.g., Starbucks, Walmart" : "Contoh: Indomaret, Starbucks")}
                    required
                    className="w-full px-3.5 py-2.5 text-xs font-bold text-slate-800 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:border-[#00685F] focus:ring-1 focus:ring-[#00685F] outline-none transition"
                  />
                </div>

                {/* Tanggal Transaksi */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t("receipts.date_label", isEn ? "Transaction Date" : "Tanggal Transaksi")}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setTransactionDate(new Date().toISOString().split("T")[0])}
                      className="text-[10px] text-[#00685F] hover:underline font-bold cursor-pointer"
                    >
                      {t("receipts.today", isEn ? "Today" : "Hari ini")}
                    </button>
                  </div>
                  <input
                    type="date"
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-xs font-bold text-slate-800 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:border-[#00685F] focus:ring-1 focus:ring-[#00685F] outline-none transition"
                  />
                </div>

                {/* Rekening Sumber */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t("receipts.account_label", isEn ? "Source Funding Account" : "Rekening Sumber Dana")}</span>
                  </label>
                  <div className="relative">
                    <select
                      value={accountId}
                      onChange={(e) => setAccountId(e.target.value)}
                      required
                      className="w-full appearance-none px-3.5 py-2.5 pr-8 text-xs font-bold text-slate-800 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:border-[#00685F] focus:ring-1 focus:ring-[#00685F] outline-none transition cursor-pointer"
                    >
                      <option value="" disabled>
                        {t("receipts.select_account", isEn ? "Select Account" : "Pilih Rekening")}
                      </option>
                      {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.name} ({isEn ? "Balance:" : "Saldo:"} {formatCurrency(acc.balance)})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Kategori Utama */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t("receipts.category_label", isEn ? "Expense Category" : "Kategori Pengeluaran")}</span>
                  </label>
                  <div className="relative">
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      required
                      className="w-full appearance-none px-3.5 py-2.5 pr-8 text-xs font-bold text-slate-800 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:border-[#00685F] focus:ring-1 focus:ring-[#00685F] outline-none transition cursor-pointer"
                    >
                      <option value="" disabled>
                        {t("receipts.select_category", isEn ? "Select Category" : "Pilih Kategori")}
                      </option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* MODE 2: ITEMIZED TABLE */}
              {mode === "itemized" && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                        {t("receipts.items_title", isEn ? "Purchased Items List" : "Daftar Barang Belanja")}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {t("receipts.items_desc", isEn ? "Edit items if misread, or click trash to remove unnecessary text lines" : "Edit item jika ada salah baca atau klik hapus untuk baris teks yang tidak perlu")}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-teal-50 text-[#00685F] rounded-lg text-xs font-bold hover:bg-teal-100 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t("receipts.add_item", isEn ? "Add Item" : "Tambah Item")}</span>
                    </button>
                  </div>

                  {items.length === 0 ? (
                    <div className="p-4 text-center rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-400">
                      {t("receipts.no_items", isEn ? "No items extracted. Click \"Add Item\" to add manually." : "Tidak ada daftar item yang terekstraksi. Klik \"Tambah Item\" untuk menambahkan secara manual.")}
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {items.map((it, idx) => (
                        <div
                          key={it.id}
                          className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 space-y-2 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 text-center text-slate-400 font-bold text-[11px]">
                              {idx + 1}.
                            </span>
                            <input
                              type="text"
                              value={it.name}
                              onChange={(e) =>
                                handleItemChange(it.id, "name", e.target.value)
                              }
                              placeholder={t("receipts.item_name_placeholder", isEn ? "Item name" : "Nama barang")}
                              className="flex-1 px-2.5 py-1.5 font-bold bg-white border border-slate-200 rounded-lg outline-none focus:border-[#00685F]"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(it.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                              title={isEn ? "Delete row" : "Hapus baris"}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-12 gap-2 pl-7">
                            <div className="col-span-3">
                              <label className="text-[10px] text-slate-400 block mb-0.5">
                                {t("receipts.qty", "Qty")}
                              </label>
                              <input
                                type="number"
                                min="0.1"
                                step="any"
                                value={it.qty}
                                onChange={(e) =>
                                  handleItemChange(it.id, "qty", e.target.value)
                                }
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg font-bold text-center"
                              />
                            </div>

                            <div className="col-span-4">
                              <label className="text-[10px] text-slate-400 block mb-0.5">
                                {t("receipts.unit_price", isEn ? "Unit Price" : "Harga Satuan")}
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={it.price}
                                onChange={(e) =>
                                  handleItemChange(it.id, "price", e.target.value)
                                }
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg font-bold text-right"
                              />
                            </div>

                            <div className="col-span-5 flex flex-col justify-end text-right">
                              <label className="text-[10px] text-slate-400 block mb-0.5">
                                {t("receipts.subtotal", "Subtotal")}
                              </label>
                              <span className="font-black text-slate-800 py-1 font-mono">
                                {formatCurrency(it.total)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Subtotal, Pajak, Diskon */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-slate-600">
                      <span>{t("receipts.items_subtotal", isEn ? "Items Subtotal" : "Subtotal Item")}</span>
                      <span className="font-bold font-mono">{formatCurrency(itemsSum)}</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-600">
                      <span className="flex items-center gap-1">{t("receipts.tax", isEn ? "Tax / VAT" : "Pajak / PPN")}</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={tax}
                          onChange={(e) => setTax(Number(e.target.value) || 0)}
                          className="w-24 px-2 py-1 bg-white border border-slate-200 rounded text-right font-bold text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-slate-600">
                      <span className="flex items-center gap-1">{t("receipts.discount", isEn ? "Discount" : "Diskon / Potongan")}</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={discount}
                          onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                          className="w-24 px-2 py-1 bg-white border border-slate-200 rounded text-right font-bold text-xs text-rose-600 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mismatch Warning */}
                  {hasMismatch && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>
                          {isEn
                            ? `Difference of ${formatCurrency(Math.abs(Number(amount) - (itemsSum + Number(tax) - Number(discount))))} between receipt total and items.`
                            : `Selisih ${formatCurrency(Math.abs(Number(amount) - (itemsSum + Number(tax) - Number(discount))))} antara total struk dan item.`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={syncTotalFromItems}
                        className="px-2.5 py-1 bg-amber-600 text-white rounded-lg font-bold text-[11px] hover:bg-amber-700 shrink-0"
                      >
                        {t("receipts.sync_total", isEn ? "Adjust Total" : "Sesuaikan Total")}
                      </button>
                    </div>
                  )}

                  {/* Checkbox: Split Transaction per Category */}
                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-950 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={splitByCategory}
                      onChange={(e) => setSplitByCategory(e.target.checked)}
                      className="mt-0.5 rounded text-[#00685F] focus:ring-[#00685F]"
                    />
                    <div className="leading-snug">
                      <span className="font-bold flex items-center gap-1">
                        <Split className="w-3.5 h-3.5 text-indigo-600" />
                        {t("receipts.split_category_label", isEn ? "Split transaction by item category" : "Pecah transaksi berdasarkan kategori item")}
                      </span>
                      <p className="text-[11px] text-indigo-700 mt-0.5">
                        {t("receipts.split_category_desc", isEn
                          ? "If the receipt has items from different categories, the system creates separate transactions so monthly budgets stay accurate."
                          : "Jika struk belanja memiliki produk dengan kategori berbeda, sistem akan membuat entri transaksi terpisah agar alokasi budget bulanan tetap akurat.")}
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {/* TOTAL AMOUNT CARD */}
              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex items-center justify-between">
                <div>
                  <label className="text-[10px] font-bold text-[#00685F] uppercase tracking-wider block">
                    {t("receipts.total_recorded", isEn ? "Total Recorded Transaction" : "Total Transaksi yang Dicatat")}
                  </label>
                  <p className="text-xs text-slate-500">
                    {mode === "summary"
                      ? t("receipts.total_recorded_sub_summary", isEn ? "Total from receipt" : "Total dari struk")
                      : t("receipts.total_recorded_sub_itemized", isEn ? "Final total after tax & discount" : "Total akhir setelah pajak & diskon")}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="1"
                    className="w-36 sm:w-44 px-3 py-1.5 text-lg font-black text-[#00685F] bg-white border border-teal-300 rounded-xl text-right outline-none focus:ring-2 focus:ring-[#00685F] font-mono"
                  />
                </div>
              </div>

              {/* STORAGE CONTROL TOGGLE */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-slate-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {t("receipts.save_photo_question", isEn ? "Save Receipt Photo as Attachment?" : "Simpan Foto Struk sebagai Lampiran?")}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {saveReceiptImage
                          ? t("receipts.save_photo_yes", isEn ? "Receipt photo will be saved as transaction proof." : "Foto struk akan disimpan sebagai bukti transaksi.")
                          : t("receipts.save_photo_no", isEn ? "Receipt photo is not saved. 0 bytes storage used & privacy protected." : "Foto struk tidak disimpan. 0 byte penyimpanan terpakai & privasi terjaga.")}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => setSaveReceiptImage(!saveReceiptImage)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      saveReceiptImage ? "bg-[#00685F]" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        saveReceiptImage ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
              >
                {t("receipts.cancel_rescan", isEn ? "Cancel / Re-scan" : "Batal / Pindai Ulang")}
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#00685F] text-white text-xs font-bold rounded-xl hover:bg-[#004D46] hover:shadow-lg hover:shadow-[#00685F]/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t("receipts.saving", isEn ? "Saving..." : "Menyimpan...")}</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{t("receipts.save_transaction", isEn ? "Confirm & Save Transaction" : "Konfirmasi & Simpan Transaksi")}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
