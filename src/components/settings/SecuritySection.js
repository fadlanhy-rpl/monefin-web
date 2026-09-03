"use client";

import { useState, useEffect, useCallback } from "react";
import { ShieldCheck, Eye, EyeOff, Lock, Smartphone, Laptop, LogOut, AlertCircle, Monitor, RefreshCw } from "lucide-react";
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
    return <Smartphone className="w-4 h-4 text-slate-400" />;
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
}) {
  const { t, language } = useLanguage();
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

  const fetchSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const data = await getSessions();
      setSessions(data);
    } catch {
      // silently fail
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handle2FAToggle = async () => {
    const newState = !user?.two_factor_enabled;
    setIs2FALoading(true);
    const result = await toggle2fa(newState);
    setIs2FALoading(false);
    if (result.success) {
      if (newState) {
        toast.success(language === "en" ? "Two-Factor Authentication enabled." : "Two-Factor Authentication diaktifkan.");
      } else {
        toast.success(language === "en" ? "Two-Factor Authentication disabled." : "Two-Factor Authentication dinonaktifkan.");
      }
    } else {
      toast.error(result.error || (language === "en" ? "Failed to change 2FA settings." : "Gagal mengubah pengaturan 2FA."));
    }
  };

  const handleRevokeSession = async (tokenId) => {
    setRevokingId(tokenId);
    try {
      await revokeSession(tokenId);
      toast.success(language === "en" ? "Session successfully signed out." : "Sesi berhasil dikeluarkan.");
      setSessions((prev) => prev.filter((s) => s.id !== tokenId));
    } catch (err) {
      toast.error(err?.data?.message || (language === "en" ? "Failed to sign out session." : "Gagal mengeluarkan sesi."));
    } finally {
      setRevokingId(null);
    }
  };

  const handleRevokeOtherSessions = async () => {
    setRevokingAll(true);
    try {
      await revokeOtherSessions();
      toast.success(language === "en" ? "All other sessions signed out successfully." : "Semua sesi lain berhasil dikeluarkan.");
      setSessions((prev) => prev.filter((s) => s.is_current));
    } catch (err) {
      toast.error(err?.data?.message || (language === "en" ? "Failed to sign out other sessions." : "Gagal mengeluarkan sesi lain."));
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
    <div className="bg-white p-5 sm:p-8 lg:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8 hover:shadow-md transition-all duration-300">
      
      {/* Header Info */}
      <div className="flex items-center gap-3 sm:gap-4 border-b border-slate-100 pb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#00685F] shrink-0 border border-emerald-100">
          <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#00685F]" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">{t("settings.security_title")}</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">{t("settings.security_desc")}</p>
        </div>
      </div>

      {/* Google user warning */}
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
          <span>{user?.has_password ? t("settings.change_password") : "Buat Password"}</span>
        </h3>

        <div className={`grid grid-cols-1 ${user?.has_password ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 sm:gap-6`}>
          <input type="text" name="username" autoComplete="username" defaultValue={user?.email || ""} className="hidden" style={{ display: 'none' }} />
          
          {user?.has_password && (
            <div className="space-y-1.5">
              <label className="text-[11px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">{t("settings.current_password")}</label>
              <div className="relative">
                <input 
                  type={showCurrent ? "text" : "password"} 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/70 rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm font-semibold focus:border-[#00685F] focus:bg-white focus:ring-4 focus:ring-[#00685F]/10 outline-none text-slate-800 pr-11 transition-all" 
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer p-1">
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">{t("settings.new_password")}</label>
            <div className="relative">
              <input 
                type={showNew ? "text" : "password"} 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/70 rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm font-semibold focus:border-[#00685F] focus:bg-white focus:ring-4 focus:ring-[#00685F]/10 outline-none text-slate-800 pr-11 transition-all" 
                placeholder={t("settings.new_password_placeholder")}
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer p-1">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">{t("settings.confirm_password")}</label>
            <div className="relative">
              <input 
                type={showConfirm ? "text" : "password"} 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/70 rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm font-semibold focus:border-[#00685F] focus:bg-white focus:ring-4 focus:ring-[#00685F]/10 outline-none text-slate-800 pr-11 transition-all" 
                placeholder={t("settings.confirm_password_placeholder")}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer p-1">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-3">
          <button type="button" onClick={onSavePassword} className="w-full sm:w-auto bg-[#00685F] text-white px-6 py-3 rounded-2xl font-extrabold hover:bg-[#004D46] transition-all shadow-md text-xs cursor-pointer active:scale-95 text-center select-none">
            {user?.has_password ? t("settings.update_password") : "Buat Password"}
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
            <h4 className="text-xs sm:text-sm font-black text-slate-900">{t("settings.two_factor")}</h4>
            <p className="text-[11px] text-slate-400 font-medium">{t("settings.two_factor_desc")}</p>
          </div>
        </div>

        {/* Real 2FA Toggle */}
        <button
          type="button"
          onClick={handle2FAToggle}
          disabled={is2FALoading}
          className={`w-12 h-6 rounded-full transition-colors duration-300 relative cursor-pointer shrink-0 p-0.5 disabled:opacity-60 ${
            twoFactorEnabled ? "bg-[#00685F]" : "bg-slate-300"
          }`}
          aria-label={twoFactorEnabled ? "Nonaktifkan 2FA" : "Aktifkan 2FA"}
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
      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center gap-1.5 sm:gap-2 flex-nowrap">
          <h4 className="text-[10px] sm:text-xs md:text-sm font-black text-slate-800 uppercase tracking-tight sm:tracking-wider flex items-center gap-1 sm:gap-1.5 shrink-0">
            <Laptop className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00685F] shrink-0" />
            <span className="truncate">{t("settings.active_sessions")}</span>
          </h4>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {otherSessionsCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSessionToRevoke(null);
                  setRevokeModalOpen(true);
                }}
                disabled={revokingAll}
                className="text-[9px] sm:text-[11px] font-bold text-red-500 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                {revokingAll ? (
                  <span className="w-3 h-3 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                ) : (
                  <LogOut className="w-3 h-3 shrink-0" />
                )}
                <span>{t("settings.logout_all_others") || "Logout semua sesi lain"}</span>
              </button>
            )}
            <button
              type="button"
              onClick={fetchSessions}
              disabled={sessionsLoading}
              className="text-slate-400 hover:text-[#00685F] transition cursor-pointer p-0.5 sm:p-1 rounded-lg hover:bg-slate-100 shrink-0"
              title="Refresh sessions"
            >
              <RefreshCw className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${sessionsLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {sessionsLoading ? (
            <div className="flex justify-center py-6">
              <span className="w-5 h-5 border-2 border-[#00685F]/20 border-t-[#00685F] rounded-full animate-spin" />
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">{t("settings.no_active_sessions") || "Tidak ada sesi aktif."}</p>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`flex justify-between items-center p-3.5 border rounded-xl text-xs transition-all ${
                  session.is_current ? "bg-emerald-50/60 border-emerald-200/60" : "bg-white border-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <DeviceIcon deviceName={session.device_name} />
                  <div>
                    <p className="font-bold text-slate-800 flex flex-wrap items-center gap-1">
                      {session.device_name}
                      {session.is_current && (
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-full">
                          {t("settings.this_device")}
                        </span>
                      )}
                      {session.is_legacy && (
                        <span className="bg-amber-100 text-amber-700 text-[9px] font-black px-2 py-0.5 rounded-full">
                          {t("settings.legacy_session") || "Sesi Lama"}
                        </span>
                      )}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {formatIP(session.ip_address, language)} • {session.last_used_at ? formatRelativeTime(session.last_used_at, language) : formatRelativeTime(session.created_at, language)}
                    </p>
                  </div>
                </div>

                {session.is_current ? (
                  <span className="text-[10px] font-bold text-emerald-600">{t("settings.active")}</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSessionToRevoke(session);
                      setRevokeModalOpen(true);
                    }}
                    disabled={revokingId === session.id}
                    className="text-[11px] font-bold text-red-500 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {revokingId === session.id ? (
                      <span className="w-3 h-3 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                    ) : (
                      <LogOut className="w-3 h-3" />
                    )}
                    {t("settings.logout")}
                  </button>
                )}
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
