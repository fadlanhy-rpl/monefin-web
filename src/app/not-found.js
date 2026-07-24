"use client";

import Link from "next/link";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function NotFound() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 9.36l-7.1 7.1a1 1 0 0 1-1.4 0l-2.83-2.83a1 1 0 0 1 0-1.4l7.1-7.1a6 6 0 0 1 9.36-7.94l-3.77 3.77a1 1 0 0 0-.01 1.41l.01-.01z"/>
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Halaman Sedang Dibuat</h2>
        <p className="text-slate-500 max-w-md mb-8">
          Fitur untuk halaman ini masih dalam tahap pengembangan. Silakan kembali nanti.
        </p>
        <Link 
          href="/" 
          className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-brand-600/30"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </DashboardLayout>
  );
}
