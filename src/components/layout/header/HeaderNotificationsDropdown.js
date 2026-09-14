"use client";

import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";

function getRelativeTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInMins = Math.floor(diffInMs / 60000);

  if (diffInMins < 1) return "Baru saja";
  if (diffInMins < 60) return `${diffInMins} menit lalu`;
  const diffInHours = Math.floor(diffInMins / 60);
  if (diffInHours < 24) return `${diffInHours} jam lalu`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} hari lalu`;
  return date.toLocaleDateString("id-ID");
}

export default function HeaderNotificationsDropdown({
  notifications,
  isNotifLoading,
  unreadCount,
  notifOpen,
  setNotifOpen,
  onCloseOthers,
  onMarkAllRead,
  onToggleRead,
}) {
  return (
    <div className="relative shrink-0">
      <button
        onClick={() => {
          setNotifOpen(!notifOpen);
          onCloseOthers();
        }}
        className="bell-wiggle relative p-2 sm:p-2.5 text-slate-600 hover:text-brand-600 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-100 shadow-sm shadow-slate-100/50"
        aria-label="Notifikasi"
        aria-expanded={notifOpen}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="pulse-dot absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        )}
      </button>

      {notifOpen && (
        <div className="dropdown-pop absolute right-0 mt-2 w-80 max-w-[85vw] bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden z-40">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
            <p className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
              Notifikasi
              {unreadCount > 0 && (
                <span className="text-[10px] bg-brand-600 text-white font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </p>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="text-[11px] font-bold text-brand-700 hover:text-brand-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Tandai semua dibaca
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
            {isNotifLoading ? (
              <div className="px-4 py-6 text-center text-xs text-slate-400 animate-pulse">Memuat notifikasi...</div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-slate-400">Belum ada notifikasi</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => onToggleRead(n.id, n.is_read)}
                  className="flex gap-3 px-4 py-3.5 hover:bg-brand-50/40 transition-colors cursor-pointer"
                >
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${!n.is_read ? "bg-brand-600" : "bg-transparent"}`}></span>
                  <div className="flex-1">
                    <p className={`text-xs sm:text-sm text-slate-700 ${!n.is_read ? "font-bold text-slate-900" : "font-medium text-slate-500"}`}>{n.message}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{getRelativeTime(n.created_at)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link
            href="/notifications"
            onClick={() => setNotifOpen(false)}
            className="block w-full text-center text-xs font-bold text-brand-700 px-4 py-3 bg-slate-50/50 hover:bg-brand-50 border-t border-slate-100 transition-colors"
          >
            Lihat Semua Notifikasi
          </Link>
        </div>
      )}
    </div>
  );
}
