"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Camera,
  Key,
  Layers,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  ArrowRight,
  HardDrive,
  Images,
  ScanLine,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ReceiptGuideModal({ isOpen, onClose, initialTab = "camera" }) {
  const [activeTab, setActiveTab] = useState(initialTab || "camera");
  const { language } = useLanguage();
  const isEn = language === "en";
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (isOpen && initialTab) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const tabs = [
    { id: "camera", label: isEn ? "Photo Basics" : "Cara Foto Struk", icon: Camera },
    { id: "multi", label: isEn ? "Long & Multi-Receipt (1–8)" : "Struk Panjang & Multi (1–8)", icon: Images },
    { id: "byok", label: isEn ? "API Key (BYOK)" : "Kunci API (BYOK)", icon: Key },
    { id: "modes", label: isEn ? "Summary vs Itemized" : "Ringkasan vs Rinci", icon: Layers },
    { id: "storage", label: isEn ? "Storage & Privacy" : "Penyimpanan & Privasi", icon: HardDrive },
  ];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-guide-modal-title"
      className="fixed inset-0 w-screen h-screen min-h-[100dvh] bg-slate-950/65 backdrop-blur-md z-[10000] flex items-center justify-center p-2.5 sm:p-5 md:p-6 overflow-y-auto"
    >
      {/* Click outside backdrop */}
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200/80 animate-in fade-in zoom-in-95 motion-reduce:animate-none duration-200 my-auto flex flex-col max-h-[92dvh] overflow-hidden relative z-10">
        {/* Header */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#E6F0EF] text-[#00685F] flex items-center justify-center font-black shrink-0 border border-[#00685F]/15">
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  id="receipt-guide-modal-title"
                  className="text-sm sm:text-base md:text-lg font-black text-slate-900 tracking-tight truncate"
                >
                  {isEn ? "Shopping Receipt Scanning Guide" : "Panduan Pindai Struk Belanja"}
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-[#E6F0EF] text-[#00685F] font-mono tabular-nums text-[10px] font-black uppercase tracking-wider">
                  {isEn ? "Up to 8 Photos" : "Maks 8 Foto"}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate sm:whitespace-normal">
                {isEn
                  ? "Single receipt, multi-part long receipt, or combine up to 8 receipts in 1 transaction"
                  : "Satu struk, struk panjang bertahap, atau gabung hingga 8 struk dalam 1 transaksi"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            aria-label={isEn ? "Close" : "Tutup"}
            className="text-slate-400 hover:text-slate-700 p-2 hover:bg-slate-100 rounded-xl transition cursor-pointer shrink-0 ml-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00685F]"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Tab Switcher (Law of Proximity & Jakob's Law) */}
        <div
          role="tablist"
          aria-label={isEn ? "Receipt Guide Sections" : "Bagian Panduan Struk"}
          className="flex border-b border-slate-100 px-3 sm:px-6 bg-white overflow-x-auto gap-1 sm:gap-1.5 shrink-0 scrollbar-none"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 py-2.5 sm:py-3 px-2.5 sm:px-3 text-[11px] sm:text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#00685F] ${
                  isActive
                    ? "border-[#00685F] text-[#00685F] bg-[#E6F0EF]/25"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/70"
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* TAB 1: CAMERA BASICS */}
          {activeTab === "camera" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#E6F0EF]/60 border border-[#00685F]/20 text-slate-800 text-xs leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="font-black text-[#00685F] text-xs sm:text-sm">
                    {isEn ? "Key to High-Precision Extraction" : "Kunci Akurasi Pembacaan Struk"}
                  </p>
                  <p className="text-slate-600 text-[11px] sm:text-xs leading-relaxed">
                    {isEn
                      ? "Vision AI reads characters and prices directly from pixels. Sharp contrast and flat framing yield 99% accuracy."
                      : "Vision AI membaca teks dan harga langsung dari ketajaman gambar. Bila struk terlalu panjang, jangan dipaksa 1 foto dari jauh—gunakan fitur Multi-Foto (1–8 bagian)."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("multi")}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#00685F] hover:bg-[#004D46] text-white rounded-xl font-bold text-[11px] transition shrink-0 cursor-pointer shadow-xs"
                >
                  <Images className="w-3.5 h-3.5" />
                  <span>{isEn ? "Long Receipt Guide" : "Cara Foto Struk Panjang"}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/35 space-y-2.5">
                  <div className="flex items-center gap-2 text-emerald-900 font-black text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{isEn ? "Best Practices (Do This)" : "Praktik Terbaik (Disarankan)"}</span>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside leading-relaxed">
                    <li>{isEn ? "Lay the receipt flat on a table surface" : "Ratakan struk di atas permukaan meja datar"}</li>
                    <li>{isEn ? "Hold camera parallel (90°) with good lighting" : "Arahkan kamera tegak lurus (90°) dengan cahaya cukup"}</li>
                    <li>{isEn ? "For long supermarket receipts, take 2–8 close-up photos from top to bottom" : "Untuk struk bulanan yang panjang, ambil 2–8 foto jarak dekat dari atas ke bawah"}</li>
                    <li>{isEn ? "Make sure store name, items, and Grand Total are visible" : "Pastikan nama toko, baris barang, dan Grand Total terlihat"}</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl border border-rose-200/80 bg-rose-50/35 space-y-2.5">
                  <div className="flex items-center gap-2 text-rose-900 font-black text-xs">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{isEn ? "Common Mistakes to Avoid" : "Hal yang Perlu Dihindari"}</span>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside leading-relaxed">
                    <li>{isEn ? "Shooting a 50cm receipt in 1 tiny distant photo (text becomes blurry)" : "Memfoto struk panjang dari jarak terlalu jauh (angka menjadi buram/pecah)"}</li>
                    <li>{isEn ? "Crumpled or folded lines hiding item prices" : "Lipatan kertas yang menutupi nominal harga"}</li>
                    <li>{isEn ? "Heavy hand shadows or camera shake" : "Bayangan tangan gelap atau kamera goyang saat memotret"}</li>
                    <li>{isEn ? "Cropping out the bottom Total / Tax section" : "Bagian Total Akhir atau diskon di bawah struk terpotong"}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LONG RECEIPT & MULTI-RECEIPT (1-8 PHOTOS) */}
          {activeTab === "multi" && (
            <div className="space-y-4">
              {/* Scenario A: Long Receipt */}
              <div className="p-4 sm:p-5 rounded-2xl border border-[#00685F]/25 bg-[#F8FAFC] space-y-3.5">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="space-y-0.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#E6F0EF] text-[#00685F] text-[10px] font-black uppercase tracking-wider">
                      <ScanLine className="w-3 h-3" />
                      <span>{isEn ? "Scenario A · Long Receipt" : "Skenario A · 1 Struk Belanja Panjang"}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 pt-1">
                      {isEn
                        ? "How to Photograph a Long Receipt in Multiple Parts (Up to 8 Photos)"
                        : "Cara Memfoto Struk Panjang Secara Bertahap (Hingga 8 Bagian Foto)"}
                    </h4>
                  </div>
                  <span className="font-mono tabular-nums text-[11px] font-bold text-[#00685F] bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    01 → 02 → ... → 08
                  </span>
                </div>

                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                  {isEn
                    ? "Instead of stepping back (which makes tiny thermal text unreadable), photograph the receipt close-up in sequential sections from top to bottom:"
                    : "Agar tulisan kecil pada kertas termal tetap tajam, jangan memfoto dari jauh. Fotolah struk dari jarak dekat secara berurutan dari atas ke bawah:"}
                </p>

                {/* Visual 3-Step Diagram */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-xl bg-white border border-slate-200/90 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono tabular-nums text-[11px] font-black px-2 py-0.5 rounded bg-[#00685F] text-white">
                        01
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {isEn ? "Top Section" : "Bagian Atas"}
                      </span>
                    </div>
                    <p className="font-bold text-slate-800 text-xs">
                      {isEn ? "Header & First Items" : "Nama Toko & Item Awal"}
                    </p>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      {isEn
                        ? "Capture store name, date, and the first group of items clearly."
                        : "Pastikan nama toko, tanggal transaksi, dan daftar barang bagian atas terlihat jelas."}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#00685F]/30 space-y-1.5 relative">
                    <div className="flex items-center justify-between">
                      <span className="font-mono tabular-nums text-[11px] font-black px-2 py-0.5 rounded bg-[#00685F] text-white">
                        02
                      </span>
                      <span className="text-[10px] font-bold text-[#00685F] uppercase">
                        {isEn ? "Middle + Overlap" : "Tengah + Overlap"}
                      </span>
                    </div>
                    <p className="font-bold text-slate-800 text-xs">
                      {isEn ? "Slide Down (1–2 Lines Overlap)" : "Geser ke Bawah (Sisakan 1–2 Baris)"}
                    </p>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      {isEn
                        ? "Keep 1–2 lines from the bottom of Photo 01 visible at the top of Photo 02. AI automatically deduplicates overlapping lines!"
                        : "Biarkan 1–2 baris terakhir dari Foto 01 ikut terlihat di bagian atas Foto 02. AI otomatis mengenali & tidak menghitung ganda!"}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200/90 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono tabular-nums text-[11px] font-black px-2 py-0.5 rounded bg-[#00685F] text-white">
                        03+
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {isEn ? "Bottom Section" : "Bagian Bawah"}
                      </span>
                    </div>
                    <p className="font-bold text-slate-800 text-xs">
                      {isEn ? "Remaining Items & Grand Total" : "Sisa Barang & Total Akhir"}
                    </p>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      {isEn
                        ? "Continue until the bottom of the receipt showing Subtotal, Discount, VAT, and Grand Total."
                        : "Lanjutkan hingga bagian paling bawah yang memuat Subtotal, Diskon, PPN, dan Total Akhir."}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#E6F0EF]/50 border border-[#00685F]/15 flex items-start gap-2 text-[11px] text-slate-700">
                  <Sparkles className="w-4 h-4 text-[#00685F] shrink-0 mt-0.5" />
                  <span>
                    {isEn ? (
                      <>
                        <strong>Smart Overlap Deduplication:</strong> Do not worry if an item appears at the bottom of Photo 1 and top of Photo 2—MoneFin AI stitches the sequence and counts that line only once.
                      </>
                    ) : (
                      <>
                        <strong>Deduplikasi Overlap Otomatis:</strong> Jangan khawatir bila ada baris barang yang terfoto dua kali di perbatasan antar foto—AI MoneFin otomatis menyambung urutan struk dan hanya menghitungnya 1 kali.
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Scenario B: Multi-Receipt Bundle */}
              <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white space-y-2.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-black uppercase tracking-wider">
                  <Layers className="w-3 h-3 text-[#00685F]" />
                  <span>{isEn ? "Scenario B · Combine Multiple Receipts" : "Skenario B · Gabung Beberapa Struk Berbeda"}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900">
                  {isEn
                    ? "Combine Up to 8 Separate Receipts into 1 Transaction"
                    : "Gabungkan Hingga 8 Struk Belanja Berbeda Menjadi 1 Transaksi"}
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                  {isEn
                    ? "Went shopping at multiple stores or have several parking/toll/food receipts from one trip? Select up to 8 receipt photos at once. AI will merge all items and sum the totals into 1 transaction (or let you split by category)."
                    : "Habis belanja dari beberapa toko sekaligus dalam satu perjalanan? Pilih atau foto hingga 8 struk berbeda sekaligus. AI otomatis menggabungkan seluruh daftar barang dan menjumlahkan total akhirnya ke dalam 1 transaksi (atau pecah otomatis per kategori)."}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: BYOK */}
          {activeTab === "byok" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>{isEn ? "Why Use Bring Your Own Key (BYOK)?" : "Mengapa Menggunakan Bring Your Own Key (BYOK)?"}</span>
                </div>
                <p className="leading-relaxed">
                  {isEn
                    ? "MoneFin does not sell your financial data or impose artificial monthly limits. By using your own API key, privacy remains 100% yours and you can take advantage of generous free tiers from leading AI providers."
                    : "MoneFin tidak menjual data keuangan Anda ataupun membatasi kuota bulanan. Dengan menggunakan API key milik Anda sendiri, privasi tetap 100% milik Anda dan Anda dapat memanfaatkan kuota gratis dari penyedia AI terkemuka."}
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-teal-100 bg-teal-50/40 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 font-black text-xs text-[#00685F]">
                    <Sparkles className="w-4 h-4" />
                    <span>{isEn ? "Recommendation: Google Gemini (100% Free)" : "Rekomendasi: Google Gemini (100% Gratis)"}</span>
                  </div>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00685F] hover:underline"
                  >
                    <span>{isEn ? "Open Google AI Studio" : "Buka Google AI Studio"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <ol className="text-xs text-slate-700 space-y-2 list-decimal list-inside">
                  <li>{isEn ? <>Open <strong>aistudio.google.com</strong> and sign in with your Google account.</> : <>Buka <strong>aistudio.google.com</strong> dan login dengan akun Google Anda.</>}</li>
                  <li>{isEn ? <>Click <strong>Get API Key</strong> then <strong>Create API Key</strong>.</> : <>Klik tombol <strong>Get API Key</strong> lalu <strong>Create API Key</strong>.</>}</li>
                  <li>{isEn ? <>Copy the generated key (starts with <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px]">AIzaSy...</code>).</> : <>Salin key yang dihasilkan (dimulai dengan <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px]">AIzaSy...</code>).</>}</li>
                  <li>{isEn ? <>Go to <strong>Settings → AI Chatbot</strong> in MoneFin, paste the key, select model <strong>gemini-3.6-flash</strong>, and save.</> : <>Buka menu <strong>Pengaturan → AI Chatbot</strong> di MoneFin, tempelkan key, pilih model <strong>gemini-3.6-flash</strong>, lalu simpan.</>}</li>
                </ol>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100 text-xs">
                <span className="text-slate-600 font-medium">
                  {isEn ? "Already have an API key?" : "Sudah punya kunci API?"}
                </span>
                <Link
                  href="/settings?tab=ai"
                  onClick={onClose}
                  className="px-3.5 py-2 bg-[#00685F] text-white font-bold rounded-xl hover:bg-[#004D46] transition flex items-center gap-1.5"
                >
                  <span>{isEn ? "Configure in Settings" : "Atur di Pengaturan"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* TAB 4: RECORDING MODES */}
          {activeTab === "modes" && (
            <div className="space-y-3.5">
              <p className="text-xs text-slate-600">
                {isEn
                  ? "After 1–8 receipt photos are scanned, choose how you want the transaction recorded:"
                  : "Setelah 1–8 foto struk selesai dipindai, Anda bebas menentukan cara pencatatannya:"}
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#E6F0EF] text-[#00685F] rounded-md text-[10px] font-black uppercase tracking-wider">
                      {isEn ? "Summary Mode" : "Mode Ringkasan"}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {isEn ? "Single Quick Transaction" : "Satu Transaksi Cepat"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isEn
                      ? "Records 1 expense line under the merchant name with the final grand total. Best for fast, clean daily bookkeeping."
                      : "Mencatat 1 baris pengeluaran atas nama toko dengan total akhir yang dibayarkan. Sangat cocok untuk pembukuan harian yang cepat, bersih, dan ringkas."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-900 text-white rounded-md text-[10px] font-black uppercase tracking-wider">
                      {isEn ? "Itemized Mode" : "Mode Terperinci"}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {isEn ? "Per-Item Breakdown & Category Split" : "Rincian Per Barang & Pecah Kategori"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isEn
                      ? "Displays every item extracted across all 1–8 photos. You can edit quantities/prices, remove lines, or check 'Split by Category' to automatically separate food, household supplies, and health items into their respective budgets."
                      : "Menampilkan seluruh daftar barang yang terekstrak dari 1–8 foto struk. Anda dapat mengoreksi harga/kuantitas, menghapus baris, atau mencentang 'Pecah per Kategori' untuk memisahkan anggaran (misal: Makanan vs Kebutuhan Rumah) secara otomatis."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: STORAGE & PRIVACY */}
          {activeTab === "storage" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#E6F0EF]/60 border border-[#00685F]/20 text-slate-900 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-black text-[#00685F]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isEn ? "Full Control Over Photo Storage" : "Kendali Penuh Penyimpanan Foto Struk"}</span>
                </div>
                <p className="leading-relaxed text-slate-700">
                  {isEn ? (
                    <>During review, you decide whether to <strong>save the receipt photo</strong> or <strong>discard it after extraction</strong>.</>
                  ) : (
                    <>Pada tahap konfirmasi review, Anda bebas memilih apakah ingin <strong>menyimpan lampiran foto struk</strong> atau <strong>tidak</strong>.</>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <p className="font-black text-slate-900">
                    {isEn ? "Option A: Save Photo (Auto-Stitched)" : "Opsi A: Simpan Foto (Otomatis Digabung)"}
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    {isEn
                      ? "If you scanned multiple photos (2–8 parts), MoneFin automatically stitches them vertically into 1 neat, compressed receipt image so you can view the full proof anytime."
                      : "Jika Anda memindai 2–8 bagian foto, MoneFin otomatis menyambungnya secara vertikal menjadi 1 lampiran struk utuh yang terkompresi rapi untuk bukti transaksi."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <p className="font-black text-slate-900">
                    {isEn ? "Option B: Don't Save Photo (0 Bytes)" : "Opsi B: Jangan Simpan Foto (Hemat 0 Byte)"}
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    {isEn
                      ? "Photos are only read in memory to extract items and numbers, then immediately discarded. 0 bytes of server storage used!"
                      : "Foto hanya dibaca sesaat untuk mengekstrak daftar barang dan nominal, lalu langsung dihapus. 0 byte ruang penyimpanan terpakai!"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            {isEn ? "Supports 1–8 photos per scan • JPG, PNG, WebP" : "Mendukung 1–8 foto per scan • JPG, PNG, WebP"}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#00685F] text-white text-xs font-bold rounded-xl hover:bg-[#004D46] transition cursor-pointer shadow-xs"
          >
            {isEn ? "Got It" : "Saya Mengerti"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
