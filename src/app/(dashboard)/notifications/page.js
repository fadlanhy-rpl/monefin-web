"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { getNotifications, markAsRead, markAllAsRead } from "../../../services/notification.service";
import { useLanguage } from "../../../context/LanguageContext";
import { Bell, CheckCheck, Loader2, AlertTriangle, AlertCircle, Clock } from "lucide-react";

export default function NotificationsPage() {
  const { t, language } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchNotifications = useCallback(async (pageNum = 1, append = false) => {
    try {
      if (!append) setIsLoading(true);
      else setIsLoadingMore(true);

      const res = await getNotifications(pageNum);
      
      if (res && res.data) {
        if (append) {
          setNotifications(prev => [...prev, ...res.data]);
        } else {
          setNotifications(res.data);
        }
        
        // Typical Laravel pagination includes current_page and last_page
        if (res.meta) {
            setHasMore(res.meta.current_page < res.meta.last_page);
        } else {
            // Fallback if meta is missing
            setHasMore(res.data.length === 20); // assuming per_page is 20
        }
      }
    } catch (error) {
      if (error?.status !== 401) {
        console.error("Failed to fetch notifications:", error.message || error);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(1, false);
  }, [fetchNotifications]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage, true);
  };

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    try {
      await markAllAsRead();
      
      // Dispatch an event so Header.js knows to update its unread count
      window.dispatchEvent(new Event('notificationsRead'));
    } catch (error) {
      console.error("Failed to mark all as read", error);
      fetchNotifications(1, false); // Revert on failure
    }
  };

  const handleMarkAsRead = async (id, isRead) => {
    if (isRead) return;
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    try {
      await markAsRead(id);
      
      // Dispatch an event so Header.js knows to update its unread count
      window.dispatchEvent(new Event('notificationsRead'));
    } catch (error) {
      console.error("Failed to mark as read", error);
      // Revert if error
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: false } : n));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { 
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(language === "en" ? 'en-US' : 'id-ID', options);
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getAlertStyles = (notif) => {
    if (notif.message && (notif.message.includes("Peringatan Kritis") || notif.message.includes("Critical Alert"))) {
      return {
        bg: !notif.is_read ? "bg-red-50 hover:bg-red-50/80" : "hover:bg-slate-50",
        dot: !notif.is_read ? "bg-red-500 shadow-sm shadow-red-500/50" : "bg-transparent",
        text: !notif.is_read ? "font-bold text-red-700" : "font-medium text-slate-600",
        icon: <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
      };
    } else if (notif.message && (notif.message.includes("Peringatan:") || notif.message.includes("Warning:"))) {
      return {
        bg: !notif.is_read ? "bg-amber-50 hover:bg-amber-50/80" : "hover:bg-slate-50",
        dot: !notif.is_read ? "bg-amber-500 shadow-sm shadow-amber-500/50" : "bg-transparent",
        text: !notif.is_read ? "font-bold text-amber-700" : "font-medium text-slate-600",
        icon: <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
      };
    }
    return {
      bg: !notif.is_read ? "bg-[#00685F]/5 hover:bg-[#00685F]/10" : "hover:bg-slate-50",
      dot: !notif.is_read ? "bg-[#00685F] shadow-sm shadow-[#00685F]/50" : "bg-transparent",
      text: !notif.is_read ? "font-bold text-slate-800" : "font-medium text-slate-600",
      icon: null
    };
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white p-6 sm:p-7 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#00685F] shrink-0 border border-emerald-100">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800">{t("notifications.title") || "Semua Notifikasi"}</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
                {language === "en" 
                  ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}.`
                  : `Anda memiliki ${unreadCount} notifikasi yang belum dibaca.`}
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-50 border border-slate-100 text-slate-400 rounded-full text-[10px] font-semibold mt-2">
                <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{t("notifications.auto_delete_notice") || "Notifikasi otomatis dihapus setelah 30 hari."}</span>
              </div>
            </div>
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllRead}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00685F]/10 text-[#00685F] font-bold rounded-xl hover:bg-[#00685F]/15 transition-all text-xs sm:text-sm cursor-pointer active:scale-95"
            >
              <CheckCheck className="w-4 h-4" />
              {t("notifications.mark_all_read") || "Tandai Semua Dibaca"}
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center text-slate-400 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#00685F]" />
              <p className="text-xs font-semibold">{t("notifications.loading") || "Memuat notifikasi..."}</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-slate-400 space-y-3">
              <Bell className="w-12 h-12 text-slate-200" />
              <p className="text-xs sm:text-sm font-medium">{t("notifications.no_notifications") || "Belum ada notifikasi saat ini."}</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notif) => {
                const styles = getAlertStyles(notif);
                return (
                  <div 
                    key={notif.id}
                    onClick={() => handleMarkAsRead(notif.id, notif.is_read)}
                    className={`p-5 sm:px-6 flex gap-4 transition-colors cursor-pointer ${styles.bg}`}
                  >
                    <div className="mt-2 shrink-0">
                      <span className={`block w-2.5 h-2.5 rounded-full ${styles.dot}`}></span>
                    </div>
                    {styles.icon && <div>{styles.icon}</div>}
                    <div className="flex-1">
                      <p className={`text-xs sm:text-sm ${styles.text}`}>
                        {notif.message}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1.5">
                        <span>{formatDate(notif.created_at)}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && !isLoading && notifications.length > 0 && (
            <div className="p-4 border-t border-slate-100">
              <button 
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="w-full py-3 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#00685F] hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("notifications.loading") || "Memuat..."}
                  </>
                ) : (
                  t("notifications.load_more") || "Tampilkan Lebih Banyak"
                )}
              </button>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
