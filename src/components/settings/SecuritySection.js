"use client";

import { useState } from "react";
import { ShieldCheck, Eye, EyeOff, Lock, Smartphone, Laptop, LogOut, AlertCircle } from "lucide-react";

export default function SecuritySection({
  user,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  onSavePassword,
  onForgotPassword
}) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  return (
    <div className="bg-white p-5 sm:p-8 lg:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8 hover:shadow-md transition-all duration-300">
      
      {/* Header Info */}
      <div className="flex items-center gap-3 sm:gap-4 border-b border-slate-100 pb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#00685F] shrink-0 border border-emerald-100">
          <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#00685F]" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">Keamanan & Password Akun</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Kelola kata sandi, otentikasi dua langkah (2FA), dan sesi aktif</p>
        </div>
      </div>

      {/* Tampilkan Peringatan untuk User Google */}
      {!user?.has_password && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-800">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
          <p className="text-sm font-medium">Akun Anda terdaftar melalui Google. Harap buat kata sandi agar Anda juga dapat masuk menggunakan Email dan Kata Sandi.</p>
        </div>
      )}

      {/* Password Change Form */}
      <div className="space-y-4">
        <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-[#00685F]" />
          <span>{user?.has_password ? "Ubah Password" : "Buat Password"}</span>
        </h3>

        <div className={`grid grid-cols-1 ${user?.has_password ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 sm:gap-6`}>
          {/* Hidden username input to trick browser autofill and prevent it from filling the search bar */}
          <input type="text" name="username" autoComplete="username" defaultValue={user?.email || ""} className="hidden" style={{ display: 'none' }} />
          
          {/* Current Password (ONLY if user has password) */}
          {user?.has_password && (
            <div className="space-y-1.5">
              <label className="text-[11px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">Password Saat Ini</label>
              <div className="relative">
                <input 
                  type={showCurrent ? "text" : "password"} 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/70 rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm font-semibold focus:border-[#00685F] focus:bg-white focus:ring-4 focus:ring-[#00685F]/10 outline-none text-slate-800 pr-11 transition-all" 
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer p-1"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-[11px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">Password Baru</label>
            <div className="relative">
              <input 
                type={showNew ? "text" : "password"} 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/70 rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm font-semibold focus:border-[#00685F] focus:bg-white focus:ring-4 focus:ring-[#00685F]/10 outline-none text-slate-800 pr-11 transition-all" 
                placeholder="Min. 8 karakter"
              />
              <button 
                type="button" 
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer p-1"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-[11px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">Konfirmasi Password</label>
            <div className="relative">
              <input 
                type={showConfirm ? "text" : "password"} 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/70 rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm font-semibold focus:border-[#00685F] focus:bg-white focus:ring-4 focus:ring-[#00685F]/10 outline-none text-slate-800 pr-11 transition-all" 
                placeholder="Ulangi password baru"
              />
              <button 
                type="button" 
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer p-1"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3">
          <button 
            type="button"
            onClick={onForgotPassword}
            className="text-xs font-extrabold text-[#00685F] hover:underline cursor-pointer select-none"
          >
            Lupa Password Anda? &rarr;
          </button>

          <button 
            type="button"
            onClick={onSavePassword}
            className="w-full sm:w-auto bg-[#00685F] text-white px-6 py-3 rounded-2xl font-extrabold hover:bg-[#004D46] transition-all shadow-md text-xs cursor-pointer active:scale-95 text-center select-none"
          >
            {user?.has_password ? "Update Password" : "Buat Password"}
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication (2FA) */}
      <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 select-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#00685F] shrink-0 shadow-xs border border-slate-100">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-slate-900">Autentikasi Dua Langkah (2FA)</h4>
            <p className="text-[11px] text-slate-400 font-medium">Lindungi akun dengan verifikasi kode OTP setiap login</p>
          </div>
        </div>

        {/* Interactive Switch */}
        <button 
          type="button"
          onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
          className={`w-12 h-6 rounded-full transition-colors duration-300 relative cursor-pointer shrink-0 p-0.5 ${
            twoFactorEnabled ? 'bg-[#00685F]' : 'bg-slate-300'
          }`}
        >
          <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 transform ${
            twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'
          }`}></div>
        </button>
      </div>

      {/* Active Login Sessions */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Laptop className="w-3.5 h-3.5 text-[#00685F]" />
          <span>Sesi Login Aktif</span>
        </h4>

        <div className="space-y-2">
          <div className="flex justify-between items-center p-3.5 bg-white border border-slate-100 rounded-xl text-xs">
            <div className="flex items-center gap-3">
              <Laptop className="w-4 h-4 text-[#00685F]" />
              <div>
                <p className="font-bold text-slate-800">Chrome pada Windows 11 <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-full ml-2">Perangkat Ini</span></p>
                <p className="text-[10px] text-slate-400">Jakarta, Indonesia • Sesi aktif sekarang</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-600">Aktif</span>
          </div>

          <div className="flex justify-between items-center p-3.5 bg-white border border-slate-100 rounded-xl text-xs">
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-slate-400" />
              <div>
                <p className="font-bold text-slate-800">MoneFin Mobile App (iPhone 15)</p>
                <p className="text-[10px] text-slate-400">Jakarta, Indonesia • 2 jam yang lalu</p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => alert("Sesi berhasil dikeluarkan.")}
              className="text-[11px] font-bold text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3 h-3" /> Keluar
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
