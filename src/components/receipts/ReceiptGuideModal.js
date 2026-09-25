"use client";

import { useState, useSyncExternalStore } from "react";
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
  HardDrive
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ReceiptGuideModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("camera");
  const { language } = useLanguage();
  const isEn = language === "en";
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);

  if (!isOpen || !mounted) return null;

  const tabs = [
    { id: "camera", label: isEn ? "How to Photo Receipt" : "Cara Foto Struk", icon: Camera },
    { id: "byok", label: isEn ? "API Key (BYOK)" : "Kunci API (BYOK)", icon: Key },
    { id: "modes", label: isEn ? "Summary vs Itemized" : "Ringkasan vs Rinci", icon: Layers },
    { id: "storage", label: isEn ? "Storage & Privacy" : "Penyimpanan & Privasi", icon: HardDrive },
  ];

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen min-h-[100dvh] bg-black/60 backdrop-blur-md z-[10000] flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto">
      {/* Click outside backdrop */}
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[90vh] overflow-hidden relative z-10">
        {/* Header */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-teal-50 text-[#00685F] flex items-center justify-center font-black shrink-0">
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base md:text-lg font-black text-slate-900 tracking-tight truncate">
                {isEn ? "Shopping Receipt Scanning Guide" : "Panduan Pindai Struk Belanja"}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate sm:whitespace-normal">
                {isEn
                  ? "Tips for accurate scanning, AI key configuration, and privacy controls"
                  : "Kiat pemindaian akurat, pengaturan kunci AI, dan kontrol privasi Anda"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            aria-label={isEn ? "Close" : "Tutup"}
            className="text-slate-400 hover:text-slate-600 p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg sm:rounded-xl transition cursor-pointer shrink-0 ml-2"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 px-3 sm:px-6 bg-white overflow-x-auto gap-1 sm:gap-2 shrink-0 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-3 text-[11px] sm:text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "border-[#00685F] text-[#00685F]"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-3.5 sm:space-y-4 flex-1 text-xs">
          {activeTab === "camera" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 text-teal-950 text-xs leading-relaxed">
                <p className="font-bold text-[#00685F] mb-1">
                  {isEn ? "Key to Scanning Success:" : "Kunci Keberhasilan Pembacaan:"}
                </p>
                {isEn
                  ? "AI reads text and numbers visually. The clearer and higher contrast the receipt photo, the more accurate the extracted figures will be."
                  : "AI membaca teks dan angka secara visual. Semakin jelas kontras foto struk, semakin tepat angka yang terekstraksi."}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{isEn ? "Best Practices (Recommended)" : "Praktik Terbaik (Direkomendasikan)"}</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li>{isEn ? "Flatten the receipt on a flat desk surface" : "Ratakan struk di atas permukaan meja datar"}</li>
                    <li>{isEn ? "Ensure sufficient lighting and avoid hand shadows" : "Pastikan pencahayaan cukup dan hindari bayangan tangan"}</li>
                    <li>{isEn ? "Point camera straight down (90 degrees)" : "Arahkan kamera tegak lurus (90 derajat)"}</li>
                    <li>{isEn ? "Ensure store name, date, items list, and total are legible" : "Pastikan nama toko, tanggal, daftar item, dan total terbaca"}</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl border border-rose-100 bg-rose-50/30 space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{isEn ? "Things to Avoid" : "Hal yang Perlu Dihindari"}</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li>{isEn ? "Folded or wrinkled receipt covering prices" : "Struk terlipat atau kusut menutupi harga"}</li>
                    <li>{isEn ? "Blurry or shaky photo due to poor focus" : "Foto buram atau goyang karena kurang fokus"}</li>
                    <li>{isEn ? "Faded thermal receipt ink" : "Tinta struk termal yang sudah terlalu pudar"}</li>
                    <li>{isEn ? "Total or tax section cropped out of frame" : "Bagian total atau PPN terpotong dari bingkai kamera"}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

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
                <div className="flex items-center justify-between">
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
                  className="px-3.5 py-1.5 bg-[#00685F] text-white font-bold rounded-xl hover:bg-[#004D46] transition flex items-center gap-1.5"
                >
                  <span>{isEn ? "Configure in Settings" : "Atur di Pengaturan"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {activeTab === "modes" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                {isEn
                  ? "After a receipt is scanned, you are free to choose how it is recorded:"
                  : "Setelah struk dipindai, Anda bebas menentukan cara pencatatannya:"}
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded-lg text-[10px] font-black uppercase tracking-wider">
                      {isEn ? "Summary Mode" : "Mode Ringkasan"}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {isEn ? "Single Quick Transaction" : "Satu Transaksi Cepat"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isEn
                      ? "Records 1 expense line under the merchant name with the total amount paid. Best for fast, clean, and concise daily bookkeeping without cluttering transaction history."
                      : "Mencatat 1 baris pengeluaran atas nama toko dengan total akhir yang dibayarkan. Sangat cocok untuk pembukuan harian yang cepat, bersih, dan ringkas tanpa memenuhi riwayat transaksi."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-lg text-[10px] font-black uppercase tracking-wider">
                      {isEn ? "Itemized Mode" : "Mode Terperinci"}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {isEn ? "Per-Item Breakdown" : "Breakdown Per Item"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isEn
                      ? "Displays a table of each purchased item (product name, quantity, unit price, and category per item). You can correct amounts, remove unnecessary lines, and optionally split budget by item category."
                      : "Menampilkan tabel tiap barang yang dibeli (nama produk, kuantitas, harga satuan, dan kategori per item). Anda dapat mengoreksi harga, menghapus item yang tidak perlu, serta memilih untuk memecah anggaran berdasarkan kategori barang (misal: makanan vs sabun)."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "storage" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 text-teal-950 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#00685F]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isEn ? "Full Control in Your Hands" : "Kendali Penuh di Tangan Anda"}</span>
                </div>
                <p className="leading-relaxed">
                  {isEn ? (
                    <>During receipt review, you can decide whether to <strong>save the receipt photo</strong> or <strong>not</strong>.</>
                  ) : (
                    <>Pada tahap konfirmasi review, Anda dapat memilih apakah ingin <strong>menyimpan foto struk</strong> atau <strong>tidak</strong>.</>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <p className="font-bold text-slate-900">
                    {isEn ? "Option A: Save Photo (Attachment)" : "Opsi A: Simpan Foto (Lampiran)"}
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    {isEn
                      ? "The compressed receipt image is saved as proof of transaction. You can view the physical receipt anytime from the transaction table."
                      : "Foto struk yang sudah dikompresi disimpan sebagai bukti transaksi. Anda dapat mengklik dan melihat kembali struk fisik kapan saja dari tabel riwayat."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <p className="font-bold text-slate-900">
                    {isEn ? "Option B: Don't Save Photo (Save Storage)" : "Opsi B: Jangan Simpan Foto (Hemat)"}
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    {isEn
                      ? "The image is processed momentarily in memory for text extraction then immediately discarded. No image files are saved on the server. 0 bytes storage used!"
                      : "Foto hanya diproses sesaat di memori browser untuk ekstraksi teks, lalu langsung dihapus. Tidak ada file gambar yang disimpan di server. 0 byte penyimpanan terpakai!"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#00685F] text-white text-xs font-bold rounded-xl hover:bg-[#004D46] transition cursor-pointer shadow-sm"
          >
            {isEn ? "Got It" : "Saya Mengerti"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
