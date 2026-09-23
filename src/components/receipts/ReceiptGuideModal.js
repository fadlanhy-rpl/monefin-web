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

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ReceiptGuideModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("camera");
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);

  if (!isOpen || !mounted) return null;

  const tabs = [
    { id: "camera", label: "Cara Foto Struk", icon: Camera },
    { id: "byok", label: "Kunci API (BYOK)", icon: Key },
    { id: "modes", label: "Ringkasan vs Rinci", icon: Layers },
    { id: "storage", label: "Penyimpanan & Privasi", icon: HardDrive },
  ];

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen min-h-[100dvh] bg-black/60 backdrop-blur-md z-[10000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Click outside backdrop */}
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[90vh] overflow-hidden relative z-10">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#00685F] flex items-center justify-center font-black">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Panduan Pindai Struk Belanja
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Kiat pemindaian akurat, pengaturan kunci AI, dan kontrol privasi Anda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 px-6 bg-white overflow-x-auto gap-2 shrink-0 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "border-[#00685F] text-[#00685F]"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === "camera" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 text-teal-950 text-xs leading-relaxed">
                <p className="font-bold text-[#00685F] mb-1">Kunci Keberhasilan Pembacaan:</p>
                AI membaca teks dan angka secara visual. Semakin jelas kontras foto struk, semakin tepat angka yang terekstraksi.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Praktik Terbaik (Direkomendasikan)</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li>Ratakan struk di atas permukaan meja datar</li>
                    <li>Pastikan pencahayaan cukup dan hindari bayangan tangan</li>
                    <li>Arahkan kamera tegak lurus (90 derajat)</li>
                    <li>Pastikan nama toko, tanggal, daftar item, dan total terbaca</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl border border-rose-100 bg-rose-50/30 space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Hal yang Perlu Dihindari</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li>Struk terlipat atau kusut menutupi harga</li>
                    <li>Foto buram atau goyang karena kurang fokus</li>
                    <li>Tinta struk termal yang sudah terlalu pudar</li>
                    <li>Bagian total atau PPN terpotong dari bingkai kamera</li>
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
                  <span>Mengapa Menggunakan Bring Your Own Key (BYOK)?</span>
                </div>
                <p className="leading-relaxed">
                  MoneFin tidak menjual data keuangan Anda ataupun membatasi kuota bulanan. Dengan menggunakan API key milik Anda sendiri, privasi tetap 100% milik Anda dan Anda dapat memanfaatkan kuota gratis dari penyedia AI terkemuka.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-teal-100 bg-teal-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-xs text-[#00685F]">
                    <Sparkles className="w-4 h-4" />
                    <span>Rekomendasi: Google Gemini (100% Gratis)</span>
                  </div>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00685F] hover:underline"
                  >
                    <span>Buka Google AI Studio</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <ol className="text-xs text-slate-700 space-y-2 list-decimal list-inside">
                  <li>Buka <strong>aistudio.google.com</strong> dan login dengan akun Google Anda.</li>
                  <li>Klik tombol <strong>Get API Key</strong> lalu <strong>Create API Key</strong>.</li>
                  <li>Salin key yang dihasilkan (dimulai dengan <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px]">AIzaSy...</code>).</li>
                  <li>Buka menu <strong>Pengaturan → AI Chatbot</strong> di MoneFin, tempelkan key, pilih model <strong>gemini-3.6-flash</strong>, lalu simpan.</li>
                </ol>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100 text-xs">
                <span className="text-slate-600 font-medium">Sudah punya kunci API?</span>
                <Link
                  href="/settings?tab=ai"
                  onClick={onClose}
                  className="px-3.5 py-1.5 bg-[#00685F] text-white font-bold rounded-xl hover:bg-[#004D46] transition flex items-center gap-1.5"
                >
                  <span>Atur di Pengaturan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {activeTab === "modes" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Setelah struk dipindai, Anda bebas menentukan cara pencatatannya:
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded-lg text-[10px] font-black uppercase tracking-wider">
                      Mode Ringkasan
                    </span>
                    <span className="text-xs font-bold text-slate-800">Satu Transaksi Cepat</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Mencatat 1 baris pengeluaran atas nama toko dengan total akhir yang dibayarkan. Sangat cocok untuk pembukuan harian yang cepat, bersih, dan ringkas tanpa memenuhi riwayat transaksi.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-lg text-[10px] font-black uppercase tracking-wider">
                      Mode Terperinci
                    </span>
                    <span className="text-xs font-bold text-slate-800">Breakdown Per Item</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Menampilkan tabel tiap barang yang dibeli (nama produk, kuantitas, harga satuan, dan kategori per item). Anda dapat mengoreksi harga, menghapus item yang tidak perlu, serta memilih untuk memecah anggaran berdasarkan kategori barang (misal: makanan vs sabun).
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
                  <span>Kendali Penuh di Tangan Anda</span>
                </div>
                <p className="leading-relaxed">
                  Pada tahap konfirmasi review, Anda dapat memilih apakah ingin <strong>menyimpan foto struk</strong> atau <strong>tidak</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <p className="font-bold text-slate-900">Opsi A: Simpan Foto (Lampiran)</p>
                  <p className="text-slate-600 leading-relaxed">
                    Foto struk yang sudah dikompresi disimpan sebagai bukti transaksi. Anda dapat mengklik dan melihat kembali struk fisik kapan saja dari tabel riwayat.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <p className="font-bold text-slate-900">Opsi B: Jangan Simpan Foto (Hemat)</p>
                  <p className="text-slate-600 leading-relaxed">
                    Foto hanya diproses sesaat di memori browser untuk ekstraksi teks, lalu langsung dihapus. Tidak ada file gambar yang disimpan di server. 0 byte penyimpanan terpakai!
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
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
