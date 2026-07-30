"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: (
        <svg
          className="w-[18px] h-[18px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      ),
    },
    {
      name: "Transactions",
      href: "/transactions",
      icon: (
        <svg
          className="w-[18px] h-[18px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 4h16v16H4z" />
          <path d="M4 9h16M8 4v16" />
        </svg>
      ),
    },
    {
      name: "Categories",
      href: "/categories",
      icon: (
        <svg
          className="w-[18px] h-[18px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.24L4 3v5.59a2 2 0 0 0 .59 1.41L14.17 19.6a2 2 0 0 0 2.82 0l3.6-3.6a2 2 0 0 0 0-2.59z" />
          <circle cx="7.5" cy="7.5" r="1.2" />
        </svg>
      ),
    },
    {
      name: "Budgets",
      href: "/budgets",
      icon: (
        <svg
          className="w-[18px] h-[18px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 9h18" />
          <path d="M7 13h4" />
        </svg>
      ),
    },
    {
      name: "Accounts",
      href: "/accounts",
      icon: (
        <svg
          className="w-[18px] h-[18px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 9.5 12 4l9 5.5" />
          <path d="M4 10v9h16v-9" />
          <path d="M9 19v-6h6v6" />
        </svg>
      ),
    },
    {
      name: "Goals",
      href: "/goals",
      icon: (
        <svg
          className="w-[18px] h-[18px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1" />
        </svg>
      ),
    },
    {
      name: "Reports",
      href: "/reports",
      icon: (
        <svg
          className="w-[18px] h-[18px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 20V10M12 20V4M20 20v-7" />
        </svg>
      ),
    },
  ];

  const BrandHeader = ({ isMobile }) => (
    <div
      className={`px-6 pt-6 pb-5 ${isMobile ? "flex items-center justify-between" : ""}`}
    >
      <div className="flex items-center gap-2">
        <div className="w-10 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
          <img
            src="/images/LogoMonefinWhite.svg"
            alt="MoneFin Logo"
            className="w-5 h-5"
          />
        </div>
        <div className="leading-tight">
          <p className="font-extrabold text-slate-800 text-[16px]">MoneFin</p>
        </div>
      </div>
      {isMobile && (
        <button
          onClick={() => setMobileOpen(false)}
          className="p-1 text-slate-500"
          aria-label="Tutup menu"
        >
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );

  const NavLinks = () => (
    <>
      <nav className="flex-1 px-3 space-y-1 mt-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (pathname === "/" && item.name === "Dashboard");
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={`sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? "active" : "text-slate-600"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 pb-6 border-t border-slate-100 pt-4">
        <Link
          href="/settings"
          onClick={() => setMobileOpen && setMobileOpen(false)}
          className={`sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${pathname === "/settings" ? "active" : "text-slate-600"}`}
        >
          <svg
            className="w-[18px] h-[18px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          Settings
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* SIDEBAR (desktop / tablet md) */}
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-white border-r border-slate-100 sticky top-0 h-screen z-30">
        <BrandHeader isMobile={false} />
        <NavLinks />
      </aside>

      {/* MOBILE SIDEBAR OVERLAY */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          ></div>
          <aside className="fixed z-50 top-0 left-0 h-full w-64 bg-white flex flex-col md:hidden transition-transform duration-300 transform translate-x-0 shadow-2xl">
            <BrandHeader isMobile={true} />
            <NavLinks />
          </aside>
        </>
      )}
    </>
  );
}
