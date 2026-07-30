"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "../../hooks/useAuth";

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="w-9 h-9 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#f4f7f6]">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header setMobileOpen={setMobileOpen} />
        <main className="px-4 sm:px-6 lg:px-8 pt-6 pb-10 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
