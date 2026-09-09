"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ShieldCheck, Eye, EyeOff, Lock, Smartphone, LogOut, AlertCircle, Monitor, RefreshCw, KeyRound, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../hooks/useAuth";
import { getSessions, revokeSession, revokeOtherSessions } from "../../services/auth.service";
import SessionRevokeModal from "./SessionRevokeModal";
import toast from "react-hot-toast";

function formatRelativeTime(date, lang = "en") {
  if (!date) return lang === "id" ? "Tidak diketahui" : "Unknown";
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return lang === "id" ? "Baru saja" : "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} ${lang === "id" ? "menit lalu" : "mins ago"}`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ${lang === "id" ? "jam lalu" : "hours ago"}`;
  return `${Math.floor(diff / 86400)} ${lang === "id" ? "hari lalu" : "days ago"}`;
}

function formatIP(ip, lang = "en") {
  if (!ip || ip === "IP tidak tersimpan") return lang === "id" ? "IP tidak tercatat" : "IP not recorded";
  if (ip === "127.0.0.1" || ip === "::1") return `${ip} (Localhost)`;
  return ip;
}

function DeviceIcon({ deviceName }) {
  const name = (deviceName || "").toLowerCase();
  if (name.includes("mobile") || name.includes("iphone") || name.includes("android")) {
    return <Smartphone className="w-4 h-4 text-slate-500" />;
  }
  return <Monitor className="w-4 h-4 text-[#00685F]" />;
}

export default function SecuritySection({
  user,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  onSavePassword,
  isSaving = false,
}) {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const { toggle2fa } = useAuth();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 2FA state — derived from user object
  const [is2FALoading, setIs2FALoading] = useState(false);

  // Sessions state
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [revokingId, setRevokingId] = useState(null);
  const [revokingAll, setRevokingAll] = useState(false);

  // Revoke confirmation modal state
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [sessionToRevoke, setSessionToRevoke] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function loadSessions() {
      try {
        const data = await getSessions();
        if (!ignore) {
          setSessions(data || []);
        }
      } catch {
        // silently fail
      } finally {
        if (!ignore) {
          setSessionsLoading(false);
        }
      }
    }
    loadSessions();
    return () => {
      ignore = true;
    };
  }, []);

  const handleRefreshSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const data = await getSessions();
      setSessions(data || []);
    } catch {
      // silently fail
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  const handle2FAToggle = async () => {
    const newState = !user?.two_factor_enabled;
    setIs2FALoading(true);
    const result = await toggle2fa(newState);
    setIs2FALoading(false);
    if (result.success) {
      if (newState) {
        toast.success(isEn ? "Two-Factor Authentication enabled." : "Two-Factor Authentication diaktifkan.");
      } else {
        toast.success(isEn ? "Two-Factor Authentication disabled." : "Two-Factor Authentication dinonaktifkan.");
      }
    } else {
      toast.error(result.error || (isEn ? "Failed to change 2FA settings." : "Gagal mengubah pengaturan 2FA."));
    }
  };

  const handleRevokeSession = async (tokenId) => {
    setRevokingId(tokenId);
    try {
      await revokeSession(tokenId);
      toast.success(isEn ? "Session successfully signed out." : "Sesi berhasil dikeluarkan.");
      setSessions((prev) => prev.filter((s) => s.id !== tokenId));
    } catch (err) {
      toast.error(err?.data?.message || (isEn ? "Failed to sign out session." : "Gagal mengeluarkan sesi."));
    } finally {
      setRevokingId(null);
    }
  };

  const handleRevokeOtherSessions = async () => {
    setRevokingAll(true);
    try {
      await revokeOtherSessions();
      toast.success(isEn ? "All other sessions signed out successfully." : "Semua sesi lain berhasil dikeluarkan.");
      setSessions((prev) => prev.filter((s) => s.is_current));
    } catch (err) {
      toast.error(err?.data?.message || (isEn ? "Failed to sign out other sessions." : "Gagal mengeluarkan sesi lain."));
    } finally {
      setRevokingAll(false);
    }
  };

  const handleConfirmRevoke = async () => {
    if (sessionToRevoke) {
      await handleRevokeSession(sessionToRevoke.id);
    } else {
      await handleRevokeOtherSessions();
    }
    setRevokeModalOpen(false);
    setSessionToRevoke(null);
  };

  const twoFactorEnabled = user?.two_factor_enabled ?? false;
  const otherSessionsCount = sessions.filter((s) => !s.is_current).length;

  return (
    <div className="bg-white p-5 sm:p-7 md:p-9 lg:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200/80 shadow-xs space-y-8 sm:space-y-10 transition-all duration-300">
      
      {/* Header Info */}
      <div className="flex items-center gap-3.5 sm:gap-4 border-b border-slate-100 pb-4">
        <div className="w-11 h-11 sm:w-12 sm:h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-[#00685F] shrink-0 border border-teal-100 shadow-2xs">
          <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#00685F]" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
            {t("settings.security_title")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
            {t("settings.security_desc")}
          </p>
        </div>
      </div>

      {/* Google user notice */}
      {!user?.has_password && (
        <div className="bg-amber-50/90 border border-amber-200/80 p-4 sm:p-5 rounded-2xl flex items-start gap-3.5 text-amber-900 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 text-xs sm:text-sm">
            <p className="font-extrabold text-amber-950">
              {isEn ? "Account registered via Google" : "Akun Terdaftar Melalui Google"}
            </p>
            <p className="text-amber-800/90 font-medium leading-relaxed">
              {isEn
                ? "Please create a password so you can also log in directly using your Email and Password."
                : "Akun Anda terdaftar melalui Google. Harap buat kata sandi agar Anda juga dapat masuk menggunakan Email dan Kata Sandi."}
            </p>
          </div>
        </div>
      )}

      {/* Password Management Form */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-[#00685F]" />
            <span>{user?.has_password ? t("settings.change_password") : (isEn ? "Create Password" : "Buat Password")}</span>
          </h3>
        </div>

        <div className={`grid grid-cols-1 ${user?.has_password ? 'md:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'} gap-4 sm:gap-5`}>
          {/* Hidden dummy field to prevent browser autofill collisions */}
          <input type="text" name="username" autoComplete="username" defaultValue={user?.email || ""} className="hidden" style={{ display: 'none' }} />
          
          {/* Current Password (if has password) */}
          {user?.has_password && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] sm:text-xs font-black text-slate-500 uppercase tracking-wider">
                  {t("settings.current_password")}
                </label>
                <Link
                  href={`/forgot-password?email=${encodeURIComponent(user?.email || "")}`}
                  className="text-[11px] font-bold text-[#00685F] hover:text-[#004D46] hover:underline transition-colors cursor-pointer select-none"
                >
                  {isEn ? "Forgot Password?" : "Lupa Password?"}
                </Link>
              </div>
              <div className="relative">
                <input 
                  type={showCurrent ? "text" : "password"} 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl px-4 py-3 sm:px-4.5 sm:py-3.5 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#00685F] focus:ring-4 focus:ring-[#00685F]/10 outline-none pr-11 transition-all placeholder:text-slate-400" 
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowCurrent(!showCurrent)} 
                  aria-label={showCurrent ? "Hide current password" : "Show current password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer rounded-xl hover:bg-slate-100"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-[11px] sm:text-xs font-black text-slate-500 uppercase tracking-wider">
              {t("settings.new_password")}
            </label>
            <div className="relative">
              <input 
                type={showNew ? "text" : "password"} 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl px-4 py-3 sm:px-4.5 sm:py-3.5 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#00685F] focus:ring-4 focus:ring-[#00685F]/10 outline-none pr-11 transition-all placeholder:text-slate-400" 
                placeholder={t("settings.new_password_placeholder") || (isEn ? "Min. 8 characters" : "Min. 8 karakter")}
              />
              <button 
                type="button" 
                onClick={() => setShowNew(!showNew)} 
                aria-label={showNew ? "Hide new password" : "Show new password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer rounded-xl hover:bg-slate-100"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-[11px] sm:text-xs font-black text-slate-500 uppercase tracking-wider">
              {t("settings.confirm_password")}
            </label>
            <div className="relative">
              <input 
                type={showConfirm ? "text" : "password"} 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl px-4 py-3 sm:px-4.5 sm:py-3.5 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#00685F] focus:ring-4 focus:ring-[#00685F]/10 outline-none pr-11 transition-all placeholder:text-slate-400" 
                placeholder={t("settings.confirm_password_placeholder") || (isEn ? "Re-enter new password" : "Ketik ulang password baru")}
              />
              <button 
                type="button" 
                onClick={() => setShowConfirm(!showConfirm)} 
                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer rounded-xl hover:bg-slate-100"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button 
            type="button" 
            onClick={onSavePassword}
            disabled={isSaving}
            className="w-full sm:w-auto min-h-[44px] bg-[#00685F] text-white px-7 sm:px-8 py-3 rounded-2xl font-extrabold hover:bg-[#004D46] transition-all shadow-md shadow-[#00685F]/20 text-xs sm:text-sm cursor-pointer active:scale-[0.98] text-center select-none disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-200" />
            <span>{user?.has_password ? t("settings.update_password") : (isEn ? "Create Password" : "Buat Password")}</span>
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication (2FA) */}
      <div className="bg-slate-50/80 p-5 sm:p-6 rounded-2xl sm:rounded-[1.5rem] border border-slate-200/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 select-none shadow-2xs">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#00685F] shrink-0 shadow-2xs border border-slate-200/80">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                {t("settings.two_factor")}
              </h4>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                twoFactorEnabled 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200/80" 
                  : "bg-slate-100 text-slate-500 border-slate-200"
              }`}>
                {twoFactorEnabled ? (isEn ? "Active" : "Aktif") : (isEn ? "Inactive" : "Nonaktif")}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-relaxed">
              {t("settings.two_factor_desc")}
            </p>
          </div>
        </div>

        {/* Real 2FA Toggle */}
        <button
          type="button"
          onClick={handle2FAToggle}
          disabled={is2FALoading}
          className={`w-12 h-6 rounded-full transition-colors duration-300 relative cursor-pointer shrink-0 p-0.5 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00685F] ${
            twoFactorEnabled ? "bg-[#00685F]" : "bg-slate-300"
          }`}
          aria-label={twoFactorEnabled ? (isEn ? "Disable 2FA" : "Nonaktifkan 2FA") : (isEn ? "Enable 2FA" : "Aktifkan 2FA")}
        >
          <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 transform ${
            twoFactorEnabled ? "translate-x-6" : "translate-x-0"
          }`}>
            {is2FALoading && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-3 h-3 border-2 border-slate-300 border-t-[#00685F] rounded-full animate-spin" />
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Active Login Sessions */}
      <div className="space-y-4 pt-1">
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 pb-1 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h4 className="text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-[#00685F]" />
              <span>{t("settings.active_sessions")}</span>
            </h4>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {sessions.length}
            </span>
          </div>

          <div className="flex items-center gap-2 self-end xs:self-auto">
            {otherSessionsCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSessionToRevoke(null);
                  setRevokeModalOpen(true);
                }}
                disabled={revokingAll}
                className="text-[11px] font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50 whitespace-nowrap px-2 py-1 rounded-lg hover:bg-red-50"
              >
                {revokingAll ? (
                  <span className="w-3 h-3 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                ) : (
                  <LogOut className="w-3 h-3 shrink-0" />
                )}
                <span>{t("settings.logout_all_others") || (isEn ? "Log out other sessions" : "Logout semua sesi lain")}</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleRefreshSessions}
              disabled={sessionsLoading}
              className="text-slate-400 hover:text-[#00685F] transition-colors cursor-pointer p-1.5 rounded-xl hover:bg-slate-100 shrink-0"
              title={isEn ? "Refresh sessions" : "Perbarui daftar sesi"}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${sessionsLoading ? "animate-spin text-[#00685F]" : ""}`} />
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          {sessionsLoading ? (
            <div className="flex justify-center py-8">
              <span className="w-5 h-5 border-2 border-[#00685F]/20 border-t-[#00685F] rounded-full animate-spin" />
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">
              {t("settings.no_active_sessions") || (isEn ? "No active sessions." : "Tidak ada sesi aktif.")}
            </p>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`flex flex-col sm:flex-row justify-between sm:items-center p-4 border rounded-2xl text-xs gap-3 transition-all ${
                  session.is_current 
                    ? "bg-emerald-50/50 border-emerald-200/80 shadow-2xs" 
                    : "bg-white border-slate-200/70 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 ${
                    session.is_current ? "bg-emerald-100/80 text-emerald-700" : "bg-slate-100 text-slate-600"
                  }`}>
                    <DeviceIcon deviceName={session.device_name} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5 font-bold text-slate-800">
                      <span>{session.device_name}</span>
                      {session.is_current && (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          {t("settings.this_device")}
                        </span>
                      )}
                      {session.is_legacy && (
                        <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-2 py-0.5 rounded-md">
                          {t("settings.legacy_session") || "Sesi Lama"}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">
                      <span className="font-mono text-slate-500">{formatIP(session.ip_address, language)}</span>
                      {" • "}
                      <span>{session.last_used_at ? formatRelativeTime(session.last_used_at, language) : formatRelativeTime(session.created_at, language)}</span>
                    </p>
                  </div>
                </div>

                <div className="flex sm:justify-end items-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {session.is_current ? (
                    <span className="text-[11px] font-extrabold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {t("settings.active")}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSessionToRevoke(session);
                        setRevokeModalOpen(true);
                      }}
                      disabled={revokingId === session.id}
                      className="text-[11px] font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50 px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      {revokingId === session.id ? (
                        <span className="w-3 h-3 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                      ) : (
                        <LogOut className="w-3.5 h-3.5" />
                      )}
                      <span>{t("settings.logout")}</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <SessionRevokeModal
        isOpen={revokeModalOpen}
        onClose={() => {
          if (!revokingId && !revokingAll) {
            setRevokeModalOpen(false);
            setSessionToRevoke(null);
          }
        }}
        onConfirm={handleConfirmRevoke}
        session={sessionToRevoke}
        otherCount={otherSessionsCount}
        isLoading={!!revokingId || revokingAll}
      />

    </div>
  );
}

