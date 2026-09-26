"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import { Navbar } from "../landing/Navbar";
import { Footer } from "../landing/Footer";
import { ApkLaunchPhonePreview } from "../mobile/AppLaunchOverlay";
import { getAuthToken } from "../../lib/api";
import {
  Download,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Share,
  PlusSquare,
  Compass,
  FolderDown,
  Settings,
  Sparkles,
  RefreshCw,
  Database,
  Lock,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  HelpCircle,
} from "lucide-react";

function subscribeNoop() {
  return () => {};
}

function getAuthSnapshot() {
  if (typeof window === "undefined") return false;
  return !!getAuthToken();
}

function getDetectedOsSnapshot() {
  if (typeof window === "undefined") return null;
  const ua = window.navigator.userAgent.toLowerCase();
  const isIosDevice =
    /iphone|ipad|ipod/.test(ua) ||
    (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
  if (isIosDevice) return "ios";
  if (/android/.test(ua)) return "android";
  return null;
}

function getStandaloneSnapshot() {
  if (typeof window === "undefined") return false;
  return Boolean(
    window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone
  );
}

export function DownloadClient() {
  const { language } = useLanguage();
  const isEn = language === "en";

  const isLoggedIn = useSyncExternalStore(subscribeNoop, getAuthSnapshot, () => false);
  const detectedOs = useSyncExternalStore(subscribeNoop, getDetectedOsSnapshot, () => null);
  const isStandalone = useSyncExternalStore(subscribeNoop, getStandaloneSnapshot, () => false);

  const [selectedOs, setSelectedOs] = useState(null); // null | 'android' | 'ios'
  const activeOs = selectedOs || detectedOs || "android";
  const setActiveOs = setSelectedOs;

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installedFromPrompt, setInstalledFromPrompt] = useState(false);
  const isInstalled = isStandalone || installedFromPrompt;
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handlePwaInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setInstalledFromPrompt(true);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText("https://www.monefin.web.id/download");
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2200);
    }
  };

  const androidApkSteps = isEn
    ? [
        {
          step: "01",
          icon: FolderDown,
          title: "Download MoneFin.apk File",
          desc: "Tap the 'Download Android APK (MoneFin.apk)' button above. The installer is ultra-lightweight (~2 MB) and finishes in seconds.",
          tip: "File name: MoneFin.apk • Official SHA-256 Signed Package",
        },
        {
          step: "02",
          icon: Settings,
          title: "Allow Installation from Browser (If Prompted)",
          desc: "Open the downloaded MoneFin.apk file from your notification bar or Downloads folder. If Android shows a security prompt ('Install unknown apps'), toggle 'Allow from this source' for your browser.",
          tip: "Why does this appear? Because you are installing directly from MoneFin's official website outside Google Play Store.",
        },
        {
          step: "03",
          icon: Smartphone,
          title: "Tap 'Install' & Launch MoneFin",
          desc: "Tap 'Install' and wait 2–3 seconds. Once finished, tap 'Open'. The MoneFin app icon will now appear on your Android Home Screen & App Drawer.",
          tip: "Runs 100% fullscreen (Trusted Web Activity) without any browser address bar.",
        },
        {
          step: "04",
          icon: Database,
          title: "Sign In & Auto-Sync with Cloud Database",
          desc: "Log in using your email or Google account. All your balances, 50/30/20 budgets, AI multi-photo receipt scans, and split bills sync in real time with the server.",
          tip: "Zero manual updates required — new features update automatically!",
        },
      ]
    : [
        {
          step: "01",
          icon: FolderDown,
          title: "Unduh File MoneFin.apk",
          desc: "Klik tombol 'Download APK Android (MoneFin.apk)' di atas. Ukuran file sangat ringan (~2 MB) sehingga selesai diunduh hanya dalam beberapa detik.",
          tip: "Nama file: MoneFin.apk • Paket Resmi Terverifikasi SHA-256",
        },
        {
          step: "02",
          icon: Settings,
          title: "Izinkan Instalasi dari Browser (Jika Diminta)",
          desc: "Buka file MoneFin.apk dari bilah notifikasi atau folder Downloads HP Anda. Jika muncul pemberitahuan standar Android ('Instal aplikasi yang tidak dikenal' / 'Setelan'), aktifkan opsi 'Izinkan dari sumber ini'.",
          tip: "Mengapa muncul? Karena Anda menginstal langsung dari situs resmi MoneFin (Direct APK) tanpa lewat Play Store.",
        },
        {
          step: "03",
          icon: Smartphone,
          title: "Ketuk 'Install / Pasang' & Buka Aplikasi",
          desc: "Ketuk tombol 'Install' (Pasang) dan tunggu 2–3 detik hingga selesai, lalu ketuk 'Buka'. Ikon aplikasi MoneFin kini otomatis tersimpan di layar utama & menu aplikasi HP Android Anda.",
          tip: "Berjalan 100% layar penuh (Fullscreen TWA) tanpa bar alamat browser di bagian atas.",
        },
        {
          step: "04",
          icon: Database,
          title: "Login & Sinkronisasi Real-Time",
          desc: "Masuk dengan akun MoneFin atau Login Google Anda. Seluruh data rekening, anggaran 50/30/20, AI Scan Struk (1–8 foto), dan Split Bill otomatis terhubung ke database utama.",
          tip: "Auto-Update: Setiap ada fitur baru, aplikasi otomatis ter-update tanpa perlu download APK ulang!",
        },
      ];

  const iosSteps = isEn
    ? [
        {
          step: "01",
          icon: Compass,
          title: "Open monefin.web.id in Safari",
          desc: "On your iPhone or iPad, open the built-in Apple Safari browser and visit www.monefin.web.id/download.",
          tip: "Important: Use Safari on iOS for the smoothest 'Add to Home Screen' experience.",
        },
        {
          step: "02",
          icon: Share,
          title: "Tap the 'Share' Button",
          desc: "Tap the Share icon (the square with an upward arrow ↑) located at the bottom center toolbar of Safari (or top right on iPad).",
          tip: "Look for the [↑] icon on Safari's bottom navigation bar.",
        },
        {
          step: "03",
          icon: PlusSquare,
          title: "Select 'Add to Home Screen'",
          desc: "Scroll down the share sheet menu and tap 'Add to Home Screen' (Tambahkan ke Layar Utama) with the [+] icon.",
          tip: "You will see the official MoneFin icon and app name ready to be added.",
        },
        {
          step: "04",
          icon: CheckCircle2,
          title: "Tap 'Add' in the Top Right Corner",
          desc: "Tap 'Add' at the top right corner. MoneFin is now installed on your iPhone Home Screen and launches in 100% fullscreen native mode!",
          tip: "Connected to the exact same cloud database & Google login as Android and Web.",
        },
      ]
    : [
        {
          step: "01",
          icon: Compass,
          title: "Buka monefin.web.id di Browser Safari",
          desc: "Pada iPhone atau iPad Anda, buka browser bawaan Apple Safari lalu kunjungi alamat www.monefin.web.id/download.",
          tip: "Penting: Gunakan browser Safari bawaan iPhone agar menu instalasi layar utama muncul lengkap.",
        },
        {
          step: "02",
          icon: Share,
          title: "Ketuk Tombol 'Share / Bagikan'",
          desc: "Ketuk ikon Share (kotak dengan tanda panah ke atas ↑) yang berada di bilah menu bagian bawah layar Safari (atau di kanan atas pada iPad).",
          tip: "Cari ikon [↑] di bagian tengah bawah layar Safari Anda.",
        },
        {
          step: "03",
          icon: PlusSquare,
          title: "Pilih 'Add to Home Screen' (Tambahkan ke Layar Utama)",
          desc: "Geser daftar menu Share ke bawah, lalu ketuk pilihan 'Add to Home Screen' atau 'Tambahkan ke Layar Utama' (ikon kotak dengan tanda tambah [+]).",
          tip: "Akan muncul pratinjau ikon resmi MoneFin beserta nama aplikasinya.",
        },
        {
          step: "04",
          icon: CheckCircle2,
          title: "Ketuk 'Add / Tambah' di Pojok Kanan Atas",
          desc: "Ketuk tombol 'Add' (Tambah) di pojok kanan atas. Aplikasi MoneFin kini langsung terpasang di Home Screen iPhone Anda dan berjalan layar penuh tanpa bar browser!",
          tip: "Terhubung langsung secara real-time dengan database dan akun MoneFin Anda.",
        },
      ];

  const activeSteps = activeOs === "android" ? androidApkSteps : iosSteps;

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-900 font-sans selection:bg-brand-600 selection:text-white flex flex-col justify-between overflow-x-hidden">
      <Navbar isLoggedIn={isLoggedIn} />

      <main className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-12 sm:space-y-16">
        {/* 1. HERO HEADER & DOWNLOAD BOX */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-extrabold tracking-wide">
            <Smartphone className="w-3.5 h-3.5 text-brand-600" />
            <span>
              {isEn
                ? "Official Mobile App • Android (.APK) & iOS (Web App)"
                : "Aplikasi Mobile Resmi • Android (.APK) & iOS (iPhone/iPad)"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 leading-[1.1]">
            {isEn
              ? "Download & Install MoneFin on Your Phone"
              : "Download & Pasang Aplikasi MoneFin di HP Anda"}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {isEn
              ? "Access your personal finances, 50/30/20 budgets, AI multi-photo receipt scanner, and live multi-currency tracker in 100% fullscreen mobile mode — synced in real time with your cloud account."
              : "Catat transaksi harian, scan struk belanja panjang (1–8 foto) dengan kamera HP, pantau anggaran 50/30/20, dan ganti mata uang secara layar penuh — 100% terhubung langsung ke akun & database MoneFin Anda."}
          </p>

          {/* OS Platform Switcher Tabs */}
          <div className="pt-3 flex justify-center">
            <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/80 border border-slate-300/70 shadow-inner gap-1.5">
              <button
                type="button"
                onClick={() => setActiveOs("android")}
                className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  activeOs === "android"
                    ? "bg-[#00685F] text-white shadow-md shadow-[#00685F]/25"
                    : "text-slate-700 hover:text-slate-950 hover:bg-white/60"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Android (.APK)</span>
                {detectedOs === "android" && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-400/25 text-emerald-100 border border-emerald-300/30">
                    {isEn ? "Your Device" : "HP Anda"}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveOs("ios")}
                className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  activeOs === "ios"
                    ? "bg-[#00685F] text-white shadow-md shadow-[#00685F]/25"
                    : "text-slate-700 hover:text-slate-950 hover:bg-white/60"
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>iOS (iPhone &amp; iPad)</span>
                {detectedOs === "ios" && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-400/25 text-emerald-100 border border-emerald-300/30">
                    {isEn ? "Your Device" : "HP Anda"}
                  </span>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* 2. PRIMARY DOWNLOAD / ACTION CARD */}
        <section className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200/90 shadow-xl shadow-slate-900/5 p-6 sm:p-10 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Direct Action */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#00685F] p-2.5 flex items-center justify-center shadow-lg shadow-[#00685F]/25 shrink-0">
                  <img
                    src="/images/logo-monefin-white.svg"
                    alt="MoneFin App Icon"
                    className="w-8 h-8 sm:w-9 sm:h-9"
                  />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      {activeOs === "android"
                        ? isEn
                          ? "MoneFin for Android (.APK)"
                          : "MoneFin untuk Android (.APK)"
                        : isEn
                        ? "MoneFin for iPhone & iPad (iOS)"
                        : "MoneFin untuk iPhone & iPad (iOS)"}
                    </h2>
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      v1.0.0 • 2026
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                    {activeOs === "android"
                      ? isEn
                        ? "Official Signed TWA Package • Android 6.0+ • Auto-Sync"
                        : "Paket APK Resmi Terverifikasi • Android 6.0+ • Sinkronisasi Otomatis"
                      : isEn
                      ? "Apple Standalone Web App (PWA) • iOS 14.0+ • Zero Storage Bloat"
                      : "Apple Standalone Web App (PWA) • iOS 14.0+ • Layar Penuh Tanpa File APK"}
                  </p>
                </div>
              </div>

              {activeOs === "android" ? (
                <div className="space-y-3.5 pt-1">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <a
                      href="/downloads/MoneFin.apk"
                      download="MoneFin.apk"
                      className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-[#00685F] hover:bg-[#004D46] text-white font-black text-sm sm:text-base shadow-lg shadow-[#00685F]/25 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <Download className="w-5 h-5 shrink-0" />
                      <span>
                        {isEn
                          ? "Download APK Android (MoneFin.apk)"
                          : "Download APK Android (MoneFin.apk)"}
                      </span>
                    </a>

                    {deferredPrompt && !isInstalled && (
                      <button
                        type="button"
                        onClick={handlePwaInstall}
                        className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-teal-50 hover:bg-teal-100 text-[#00685F] border border-teal-200 font-extrabold text-xs sm:text-sm transition-all cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 shrink-0" />
                        <span>
                          {isEn ? "1-Click Instant Install" : "Pasang Instan Tanpa APK"}
                        </span>
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-500 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      {isEn ? "SHA-256 Verified & Ad-Free" : "Aman, Resmi & Bebas Iklan"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-4 h-4 text-brand-600" />
                      {isEn ? "Auto-Updates via Cloud" : "Auto-Update Fitur Otomatis"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-brand-600" />
                      {isEn ? "Google Login Supported" : "Mendukung Login Google & 2FA"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5 pt-1">
                  <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
                    <p className="font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#00685F] shrink-0" />
                      <span>
                        {isEn
                          ? "How to install on iPhone / iPad (No .APK needed):"
                          : "Cara pasang di iPhone / iPad (Tanpa perlu file .APK):"}
                      </span>
                    </p>
                    <p>
                      {isEn
                        ? "Apple iOS does not use .apk files. Instead, open this page in Safari, tap the Share [↑] button at the bottom of the screen, and select 'Add to Home Screen'. MoneFin will install directly onto your iPhone Home Screen in 100% fullscreen mode!"
                        : "Sistem operasi Apple (iOS) tidak menggunakan format file .apk. Anda cukup membuka halaman ini di browser Safari iPhone, ketuk tombol Share [↑] di bagian bawah layar, lalu pilih 'Add to Home Screen' (Tambahkan ke Layar Utama)."}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href="#install-guide"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#00685F] hover:bg-[#004D46] text-white font-black text-xs sm:text-sm shadow-md shadow-[#00685F]/20 transition-all"
                    >
                      <span>
                        {isEn
                          ? "See 4-Step Visual iOS Guide Below"
                          : "Lihat 4 Langkah Cara Pasang di iOS"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </a>

                    <Link
                      href={isLoggedIn ? "/dashboard" : "/login"}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-all"
                    >
                      <span>
                        {isLoggedIn
                          ? isEn
                            ? "Open Dashboard"
                            : "Buka Dashboard"
                          : isEn
                          ? "Sign In Now"
                          : "Login Sekarang"}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Quick Share / Open on Phone Box */}
            <div className="lg:col-span-5 bg-slate-50 rounded-3xl p-5 sm:p-6 border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                  {isEn ? "Opening from a Laptop / PC?" : "Membuka dari Laptop / PC?"}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 border border-brand-200/60">
                  Android &amp; iOS
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {isEn
                  ? "Copy the download link below and open it on your Android phone (to download MoneFin.apk) or on your iPhone Safari browser:"
                  : "Salin tautan di bawah ini dan buka di HP Android Anda (untuk mengunduh MoneFin.apk) atau di browser Safari iPhone Anda:"}
              </p>

              <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                <code className="text-xs font-bold text-slate-800 px-2 truncate flex-1">
                  https://www.monefin.web.id/download
                </code>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00685F] text-white text-xs font-bold hover:bg-[#004D46] transition cursor-pointer shrink-0"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{isEn ? "Copied" : "Tersalin"}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isEn ? "Copy" : "Salin"}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-1 border-t border-slate-200/70 grid grid-cols-2 gap-2.5 text-[11px] font-bold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{isEn ? "Real-time DB Sync" : "Database Real-time"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{isEn ? "Camera Receipt Scan" : "Kamera Scan Struk"}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2B. INTERACTIVE APK LAUNCH ANIMATION PREVIEW (HERO-INSPIRED & UI/UX LAWS COMPLIANT) */}
        <section className="bg-gradient-to-br from-[#041714] via-[#06241F] to-[#041512] rounded-3xl sm:rounded-[2.5rem] border border-emerald-500/30 shadow-2xl p-6 sm:p-10 text-white relative overflow-hidden">
          <div className="absolute -top-28 -left-28 w-80 h-80 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-28 -right-28 w-80 h-80 rounded-full bg-teal-400/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left: Interactive Smartphone Frame Running the APK Boot Animation */}
            <div className="lg:col-span-5 flex justify-center">
              <ApkLaunchPhonePreview />
            </div>

            {/* Right: UI/UX Laws Breakdown & Why Not Just a Static Logo */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {isEn
                    ? "Interactive Launch Experience • UI/UX Laws"
                    : "Pengalaman Saat APK Dibuka • Sesuai UI/UX Laws"}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                {isEn
                  ? "More Than a Static Logo: Hero-Caliber Fintech Cockpit Awakening"
                  : "Bukan Sekadar Logo Statis: Animasi Live Financial Cockpit Saat APK Dibuka"}
              </h2>

              <p className="text-xs sm:text-sm text-emerald-100/85 leading-relaxed">
                {isEn
                  ? "When you open MoneFin on Android (.APK) or iOS (Home Screen App), you are greeted by a 60fps choreographed launch sequence inspired by the landing page Hero section — engineered strictly around 4 core UI/UX Laws:"
                  : "Saat Anda membuka aplikasi MoneFin di HP (baik versi .APK Android maupun Web App iOS), aplikasi menampilkan animasi interaktif 60fps bernuansa Hero Section — dirancang khusus mengikuti 4 hukum utama UI/UX:"}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-300">
                      1. Doherty Threshold (&lt; 400ms)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200">
                      1.8s Total
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isEn
                      ? "Zero blank white screen. 60fps emerald streamlines awaken in <100ms while Chrome TWA / Skipper API warms up in the background, finishing in 1.8s (or tap anywhere to skip)."
                      : "Tanpa layar putih kosong. Gelombang kanvas 60fps langsung aktif dalam <100ms sembari menghubungkan sesi ke server di latar belakang, selesai dalam 1,8 detik (atau ketuk layar untuk lewati)."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-300">
                      2. Miller&apos;s Law (4 Visual Chunks)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200">
                      Zero Clutter
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isEn
                      ? "Visual elements are chunked into 4 clean groups: Brand Pill, Net Worth + 50/30/20 Cockpit Card, 2 Floating Satellite Badges (Cashflow & Health Score), and Sync Bar."
                      : "Elemen visual dikelompokkan tepat menjadi 4 fokus utama: Identitas Brand, Kartu Kokpit Kekayaan Bersih + Bar 50/30/20, 2 Kartu Satelit Melayang, dan Indikator Sinkronisasi."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-300">
                      3. Peak-End Rule &amp; Trust
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200">
                      256-Bit Vault
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isEn
                      ? "Instead of a lifeless icon, live counting Net Worth and 50/30/20 bar progression communicate security, precision, and financial control from the very first second."
                      : "Alih-alih ikon kaku, animasi penghitungan saldo dan pengisian bar 50/30/20 memberikan rasa aman, presisi, dan kendali finansial sejak detik pertama aplikasi dibuka."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-300">
                      4. Jakob&apos;s Law (Native Feel)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200">
                      60 FPS Native
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isEn
                      ? "Compiled natively inside MoneFin.apk (Android Canvas + Hardware Acceleration) and mirrored on iOS Standalone Web App for a unified flagship fintech feel."
                      : "Dikompilasi langsung secara native di dalam MoneFin.apk (Android Canvas 60fps) serta Web App iOS sehingga transisi menuju Dashboard terasa mulus seperti aplikasi bank digital."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. STEP-BY-STEP INSTALLATION GUIDE (ANDROID & iOS) */}
        <section id="install-guide" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-brand-600">
                {isEn ? "Step-by-Step Installation Guide" : "Panduan Lengkap Cara Instalasi"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {activeOs === "android"
                  ? isEn
                    ? "How to Install MoneFin.apk on Android"
                    : "Cara Install Aplikasi MoneFin (.APK) di Android"
                  : isEn
                  ? "How to Install MoneFin on iPhone & iPad (iOS)"
                  : "Cara Install Aplikasi MoneFin di iPhone & iPad (iOS)"}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveOs("android")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  activeOs === "android"
                    ? "bg-brand-600 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {isEn ? "Android Guide" : "Panduan Android"}
              </button>
              <button
                type="button"
                onClick={() => setActiveOs("ios")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  activeOs === "ios"
                    ? "bg-brand-600 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {isEn ? "iOS (iPhone) Guide" : "Panduan iOS (iPhone)"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeSteps.map((item) => {
              const StepIcon = item.icon;
              return (
                <div
                  key={item.step}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-brand-300 transition-all flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 border border-brand-200/70">
                        <StepIcon className="w-5 h-5" />
                      </span>
                      <span className="text-xs font-black px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-mono">
                        {isEn ? `STEP ${item.step}` : `LANGKAH ${item.step}`}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] font-semibold text-brand-800 bg-brand-50/60 px-3 py-2 rounded-xl">
                    <HelpCircle className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                    <span>{item.tip}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. SIDE-BY-SIDE ANDROID & iOS QUICK SUMMARY */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 space-y-3">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-[#00685F]" />
              <h3 className="text-base font-black text-slate-900">
                {isEn
                  ? "Alternative for Android (Without APK File)"
                  : "Cara Alternatif Android (Tanpa Download File APK)"}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isEn
                ? "Prefer not to download an .apk file? Open monefin.web.id in Google Chrome on Android, tap the three-dot menu (⋮) in the top-right corner, and tap 'Install app' or 'Add to Home screen'."
                : "Tidak ingin mengunduh file .apk? Anda juga bisa membuka monefin.web.id di Google Chrome Android, ketuk ikon titik tiga (⋮) di pojok kanan atas, lalu pilih 'Instal aplikasi' atau 'Tambahkan ke layar utama'."}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 space-y-3">
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-[#00685F]" />
              <h3 className="text-base font-black text-slate-900">
                {isEn
                  ? "100% Connected to Cloud Database & Backend"
                  : "100% Terhubung ke Database & Akun Utama"}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isEn
                ? "Whether you log in from the Android APK, iPhone Web App, or Desktop browser, your accounts, categories, transactions, and AI receipt scans are synchronized instantly."
                : "Baik Anda login dari APK Android, aplikasi iPhone (iOS), maupun browser Laptop, seluruh saldo rekening, kategori, riwayat transaksi, dan AI Scan Struk tersinkronisasi secara real-time."}
            </p>
          </div>
        </section>
      </main>

      <Footer isLoggedIn={isLoggedIn} />
    </div>
  );
}
