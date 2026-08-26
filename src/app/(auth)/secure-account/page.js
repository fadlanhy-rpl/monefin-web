"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, ShieldCheck, AlertTriangle, ArrowRight, Lock, KeyRound, Loader2, ArrowLeft } from "lucide-react";
import { secureAccount } from "../../../services/auth.service";
import toast from "react-hot-toast";

function SecureAccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Tautan pengamanan tidak memiliki token valid.");
      return;
    }

    let isMounted = true;

    async function executeSecure() {
      try {
        const response = await secureAccount(token);
        if (isMounted) {
          setResultData(response.data);
          setStatus("success");
          toast.success("Sesi penyusup berhasil dicabut!");
        }
      } catch (err) {
        if (isMounted) {
          setStatus("error");
          setErrorMessage(err.message || "Tautan pengamanan tidak valid atau telah kedaluwarsa.");
        }
      }
    }

    executeSecure();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-100 p-8 text-center relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className={`absolute top-0 left-0 right-0 h-2 ${
          status === "loading" 
            ? "bg-gradient-to-r from-amber-400 to-amber-600 animate-pulse" 
            : status === "success" 
            ? "bg-gradient-to-r from-emerald-500 to-brand-600" 
            : "bg-gradient-to-r from-red-500 to-rose-600"
        }`} />

        {/* 1. LOADING STATE */}
        {status === "loading" && (
          <div className="py-8 space-y-6 animate-in fade-in duration-300">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-amber-600 relative">
              <span className="absolute inset-0 rounded-3xl border-2 border-amber-400 animate-ping opacity-25" />
              <ShieldAlert className="w-10 h-10 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-900">Mengamankan Akun Anda...</h2>
              <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                Sedang memverifikasi data dan memutuskan akses sesi yang mencurigakan.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50/80 py-2.5 px-4 rounded-xl border border-amber-200/60 max-w-xs mx-auto">
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span>Memproses pencabutan sesi instan...</span>
            </div>
          </div>
        )}

        {/* 2. SUCCESS STATE */}
        {status === "success" && (
          <div className="py-4 space-y-6 animate-in zoom-in-95 duration-400">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-500/10">
              <ShieldCheck className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                ✓ Sesi Berhasil Diputus
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Akun Berhasil Diamankan!</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Sesi perangkat <span className="font-semibold text-slate-800">"{resultData?.device_name || "Mencurigakan"}"</span> telah dikeluarkan secara permanen.
              </p>
            </div>

            {/* OTP Alert Box */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <KeyRound className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Langkah Terakhir: Ganti Password Anda</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kami telah mengirimkan <strong>kode OTP</strong> reset kata sandi ke email Anda (<span className="text-slate-700 font-medium">{resultData?.email}</span>).
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <Link
                href={`/reset-password?email=${encodeURIComponent(resultData?.email || "")}`}
                className="w-full py-3.5 px-5 rounded-2xl bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-brand-600/25 flex items-center justify-center gap-2 transition-all"
              >
                <span>Buat Password Baru Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors py-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Halaman Login</span>
              </Link>
            </div>
          </div>
        )}

        {/* 3. ERROR / EXPIRED STATE */}
        {status === "error" && (
          <div className="py-4 space-y-6 animate-in zoom-in-95 duration-400">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-50 border-2 border-rose-200 flex items-center justify-center text-rose-600 shadow-lg shadow-rose-500/10">
              <AlertTriangle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider">
                Tautan Kedaluwarsa
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Tautan Tidak Valid</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                {errorMessage}
              </p>
            </div>

            <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/60 text-left">
              <p className="text-xs text-amber-800 leading-relaxed">
                💡 <strong>Tips Keamanan:</strong> Jika Anda tetap ingin mengamankan akun dan mengubah kata sandi, Anda dapat meminta kode reset password baru melalui menu Lupa Password.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                href="/forgot-password"
                className="w-full py-3.5 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-slate-900/15 flex items-center justify-center gap-2 transition-all"
              >
                <Lock className="w-4 h-4" />
                <span>Minta Reset Password Manual</span>
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors py-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Halaman Login</span>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function SecureAccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    }>
      <SecureAccountContent />
    </Suspense>
  );
}
