"use client";

import { useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Repeat,
  Wallet,
  PieChart,
  Tags,
  Target,
  BarChart3,
  Trophy,
  Receipt,
  Settings,
  Trash2,
  Sparkles,
  X,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../hooks/useAuth";

// Header Brand MoneFin (Dideklarasikan di luar render agar tidak memicu reset state)
function BrandHeader({ isMobile, onMobileClose }) {
  return (
    <div className="px-4 lg:px-5 py-4 lg:py-5 flex items-center justify-between border-b border-slate-100 shrink-0">
      <Link
        href="/dashboard"
        onClick={onMobileClose}
        className="flex items-center gap-2.5 group cursor-pointer select-none min-w-0"
      >
        <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-[#00685F] to-[#004D46] flex items-center justify-center shadow-md shadow-[#00685F]/20 group-hover:scale-105 transition-transform shrink-0">
          <Image
            src="/images/LogoMonefinWhite.svg"
            alt="MoneFin"
            width={20}
            height={20}
            className="w-5 h-5 object-contain"
          />
        </div>
        <div className="min-w-0">
          <span className="font-black text-slate-900 text-base lg:text-lg tracking-tight leading-none block">
            MoneFin
          </span>
          <span className="text-[10px] text-slate-400 font-semibold tracking-wider block mt-0.5">
            Personal Finance
          </span>
        </div>
      </Link>

      {isMobile && (
        <button
          type="button"
          onClick={onMobileClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Tutup menu navigasi"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

// Konten Navigasi, Quick Guide Banner, dan Profil (Dideklarasikan di luar render)
function SidebarBody({ navGroups, pathname, user, t, onLinkClick, onOpenTutorial }) {
  const isItemActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const userAvatar = user?.photo
    ? user.photo.startsWith("http")
      ? user.photo
      : `/api/avatar/${user.photo}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=00685F&color=fff&size=64`;

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
      {/* Daftar Tautan Navigasi (Scrollable) */}
      <nav className="flex-1 overflow-y-auto overscroll-contain px-2.5 sm:px-3 py-3 space-y-4 scrollbar-none [&::-webkit-scrollbar]:hidden">
        {navGroups.map((group) => (
          <div key={group.id} className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 pb-0.5 select-none">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isItemActive(item.href);
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onLinkClick}
                    title={item.name}
                    className={`group relative flex items-center gap-3 px-3 py-2 lg:py-2.5 rounded-xl text-xs lg:text-[13px] transition-all duration-200 outline-none select-none ${
                      active
                        ? "bg-[#00685F]/10 text-[#00685F] font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium"
                    }`}
                  >
                    {/* Aksen strip indikator di sisi kiri saat aktif */}
                    {active && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#00685F] rounded-r-full" />
                    )}

                    <IconComponent
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                        active
                          ? "text-[#00685F] scale-105"
                          : "text-slate-400 group-hover:text-slate-700 group-hover:scale-110"
                      }`}
                    />

                    <span className="truncate flex-1">{item.name}</span>

                    {active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00685F] shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bagian Bawah: Banner Panduan & Info Profil Pengguna */}
      <div className="p-3 border-t border-slate-100 space-y-2.5 shrink-0 bg-slate-50/40">
        {/* Banner Pintas: Panduan Interaktif MoneFin */}
        <button
          type="button"
          onClick={onOpenTutorial}
          className="w-full p-2.5 rounded-2xl bg-gradient-to-br from-teal-50/90 to-emerald-50/40 border border-teal-100/80 hover:border-teal-200 hover:shadow-xs transition-all flex items-center justify-between gap-2 text-left group cursor-pointer active:scale-[0.98]"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#00685F]/10 flex items-center justify-center shrink-0 text-[#00685F] group-hover:scale-105 transition-transform">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-black text-slate-800 leading-tight truncate">
                {t("sidebar.guide_banner_title") || "Panduan MoneFin"}
              </p>
              <p className="text-[9px] text-slate-400 font-medium truncate">
                {t("sidebar.guide_banner_desc") || "Pelajari alur fitur"}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-[#00685F] shrink-0 bg-white px-2 py-1 rounded-lg border border-teal-100 shadow-2xs group-hover:bg-teal-50 transition-colors">
            {t("sidebar.guide_banner_btn") || "Buka"}
          </span>
        </button>

        {/* Mini Profile Card */}
        {user && (
          <Link
            href="/settings"
            onClick={onLinkClick}
            className="flex items-center gap-2.5 p-2 rounded-2xl hover:bg-slate-100/80 transition-colors group cursor-pointer select-none"
            title={t("sidebar.settings") || "Pengaturan Akun"}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={userAvatar}
              alt={user.name || "User"}
              className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200/80 group-hover:ring-2 group-hover:ring-[#00685F]/30 transition-all"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=00685F&color=fff&size=64`;
              }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate leading-tight group-hover:text-[#00685F] transition-colors">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-400 font-medium truncate">
                {user.email}
              </p>
            </div>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-[#00685F] transition-colors shrink-0">
              <Settings className="w-3.5 h-3.5" />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user } = useAuth();

  const handleMobileClose = useCallback(() => {
    if (setMobileOpen) setMobileOpen(false);
  }, [setMobileOpen]);

  // Kunci scroll body saat drawer mobile terbuka agar pengalaman sentuh nyaman
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Tutup drawer mobile saat menekan tombol Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && mobileOpen) {
        handleMobileClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, handleMobileClose]);

  // Kelompok Navigasi Terstruktur
  const navGroups = [
    {
      id: "main",
      label: t("sidebar.group_main") || "Menu Utama",
      items: [
        {
          name: t("sidebar.dashboard") || "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          name: t("sidebar.transactions") || "Transaksi",
          href: "/transactions",
          icon: ArrowLeftRight,
        },
        {
          name: t("sidebar.recurring") || "Transaksi Rutin",
          href: "/recurring",
          icon: Repeat,
        },
      ],
    },
    {
      id: "finance",
      label: t("sidebar.group_finance") || "Keuangan",
      items: [
        {
          name: t("sidebar.accounts") || "Rekening & Dompet",
          href: "/accounts",
          icon: Wallet,
        },
        {
          name: t("sidebar.budgets") || "Anggaran",
          href: "/budgets",
          icon: PieChart,
        },
        {
          name: t("sidebar.categories") || "Kategori",
          href: "/categories",
          icon: Tags,
        },
        {
          name: t("sidebar.goals") || "Target Impian",
          href: "/goals",
          icon: Target,
        },
      ],
    },
    {
      id: "tools",
      label: t("sidebar.group_tools") || "Wawasan & Alat",
      items: [
        {
          name: t("sidebar.reports") || "Laporan",
          href: "/reports",
          icon: BarChart3,
        },
        {
          name: t("sidebar.rewards") || "Quests & Hadiah",
          href: "/rewards",
          icon: Trophy,
        },
        {
          name: t("sidebar.split_bill") || "Smart Split Bill",
          href: "/split-bill",
          icon: Receipt,
        },
      ],
    },
    {
      id: "system",
      label: t("sidebar.group_system") || "Sistem",
      items: [
        {
          name: t("sidebar.settings") || "Pengaturan",
          href: "/settings",
          icon: Settings,
        },
        {
          name: t("sidebar.trashbin") || "Kotak Sampah",
          href: "/trashbin",
          icon: Trash2,
        },
      ],
    },
  ];

  const handleOpenTutorial = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-onboarding-tutorial"));
      handleMobileClose();
    }
  };

  return (
    <>
      {/* ── SIDEBAR DESKTOP & TABLET (Sticky, responsif md/lg/xl) ── */}
      <aside className="hidden md:flex md:flex-col w-52 lg:w-60 xl:w-64 shrink-0 bg-white border-r border-slate-100 sticky top-0 h-screen z-30 transition-all duration-300 select-none">
        <BrandHeader isMobile={false} onMobileClose={handleMobileClose} />
        <SidebarBody
          navGroups={navGroups}
          pathname={pathname}
          user={user}
          t={t}
          onLinkClick={handleMobileClose}
          onOpenTutorial={handleOpenTutorial}
        />
      </aside>

      {/* ── SIDEBAR MOBILE (Slide-over Drawer dengan Backdrop Blur) ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop gelap dengan klik luar untuk menutup */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
            onClick={handleMobileClose}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <aside className="relative z-10 w-[280px] max-w-[85vw] h-full bg-white flex flex-col shadow-2xl animate-in slide-in-from-left duration-300 ease-out border-r border-slate-100 select-none">
            <BrandHeader isMobile={true} onMobileClose={handleMobileClose} />
            <SidebarBody
              navGroups={navGroups}
              pathname={pathname}
              user={user}
              t={t}
              onLinkClick={handleMobileClose}
              onOpenTutorial={handleOpenTutorial}
            />
          </aside>
        </div>
      )}
    </>
  );
}
